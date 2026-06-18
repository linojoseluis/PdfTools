import { pdfjs, loadPdfDocument, renderPageToCanvas, canvasToBlob } from './pdfJsClient';
import type { ExtractedImage } from './types';

type ExtractOptions = {
  includeRenderedPages?: boolean;
  renderScale?: number;
  onProgress?: (current: number, total: number) => void;
};

async function extractEmbeddedFromPage(
  page: pdfjs.PDFPageProxy,
  pageNumber: number,
): Promise<ExtractedImage[]> {
  const results: ExtractedImage[] = [];
  const opList = await page.getOperatorList();
  const { fnArray, argsArray } = opList;
  const imageNames = new Set<string>();

  for (let i = 0; i < fnArray.length; i += 1) {
    const fn = fnArray[i];
    if (
      fn === pdfjs.OPS.paintImageXObject ||
      fn === pdfjs.OPS.paintInlineImageXObject ||
      fn === pdfjs.OPS.paintImageMaskXObject
    ) {
      const name = argsArray[i]?.[0];
      if (typeof name === 'string') {
        imageNames.add(name);
      }
    }
  }

  let index = 0;
  for (const name of imageNames) {
    try {
      const obj = await page.objs.get(name);
      if (!obj || typeof obj !== 'object') continue;

      const bitmap = obj as {
        bitmap?: ImageBitmap;
        width?: number;
        height?: number;
        data?: Uint8ClampedArray;
      };

      let blob: Blob | null = null;
      let width = 0;
      let height = 0;

      if (bitmap.bitmap) {
        width = bitmap.width ?? bitmap.bitmap.width;
        height = bitmap.height ?? bitmap.bitmap.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap.bitmap, 0, 0);
          blob = await canvasToBlob(canvas);
        }
      } else if (bitmap.data && bitmap.width && bitmap.height) {
        width = bitmap.width;
        height = bitmap.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = new ImageData(bitmap.data, width, height);
          ctx.putImageData(imageData, 0, 0);
          blob = await canvasToBlob(canvas);
        }
      }

      if (blob) {
        results.push({
          pageNumber,
          index: index++,
          blob,
          width,
          height,
          source: 'embedded',
        });
      }
    } catch {
      // Skip images that cannot be resolved
    }
  }

  return results;
}

export async function extractImagesFromPdf(
  data: ArrayBuffer | Uint8Array,
  options: ExtractOptions = {},
): Promise<ExtractedImage[]> {
  const {
    includeRenderedPages = true,
    renderScale = 1.5,
    onProgress,
  } = options;

  const doc = await loadPdfDocument(data);
  const total = doc.numPages;
  const allImages: ExtractedImage[] = [];

  for (let pageNum = 1; pageNum <= total; pageNum += 1) {
    onProgress?.(pageNum, total);
    const page = await doc.getPage(pageNum);
    const embedded = await extractEmbeddedFromPage(page, pageNum);
    allImages.push(...embedded);

    if (embedded.length === 0 && includeRenderedPages) {
      const canvas = await renderPageToCanvas(page, renderScale);
      const blob = await canvasToBlob(canvas);
      allImages.push({
        pageNumber: pageNum,
        index: 0,
        blob,
        width: canvas.width,
        height: canvas.height,
        source: 'rendered',
      });
    }
  }

  return allImages;
}
