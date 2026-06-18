import { useCallback, useState } from 'react';
import { extractImagesFromPdf } from '@/shared/lib/pdf/extractImages';
import type { ExtractedImage } from '@/shared/lib/pdf/types';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { useDownload } from '@/shared/hooks/useDownload';
import { readFileAsArrayBuffer } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isPdfFile } from '@/shared/lib/validation';

export function useExtractImages() {
  const [fileName, setFileName] = useState('');
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [includeRendered, setIncludeRendered] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<ExtractedImage[]>();
  const { downloadBlob, downloadZip } = useDownload();

  const loadAndExtract = useCallback(
    async (file: File) => {
      setError(null);
      try {
        if (!isPdfFile(file)) throw new Error('Selecione um ficheiro PDF.');
        assertMaxSize(file);
        const buffer = await readFileAsArrayBuffer(file);
        setFileName(file.name.replace(/\.pdf$/i, ''));

        const result = await task.run(async (report) => {
          return extractImagesFromPdf(buffer, {
            includeRenderedPages: includeRendered,
            onProgress: (current, total) => {
              report(Math.round((current / total) * 100));
            },
          });
        });

        setImages(result);
        if (result.length === 0) {
          setError('Nenhuma imagem encontrada neste PDF.');
        }
      } catch (err) {
        if (err instanceof Error && !task.error) {
          setError(err.message);
        }
      }
    },
    [includeRendered, task],
  );

  const downloadAll = useCallback(async () => {
    if (images.length === 0) return;
    await downloadZip(
      images.map((img, i) => ({
        name: `${fileName}-p${img.pageNumber}-${img.source}-${i + 1}.png`,
        data: img.blob,
      })),
      `${fileName}-images.zip`,
    );
  }, [images, fileName, downloadZip]);

  const downloadOne = useCallback(
    (img: ExtractedImage, index: number) => {
      downloadBlob(
        img.blob,
        `${fileName}-p${img.pageNumber}-${img.source}-${index + 1}.png`,
      );
    },
    [fileName, downloadBlob],
  );

  const reset = useCallback(() => {
    setImages([]);
    setFileName('');
    setError(null);
    task.reset();
  }, [task]);

  return {
    images,
    includeRendered,
    error: error ?? task.error,
    status: task.status,
    progress: task.progress,
    setIncludeRendered,
    loadAndExtract,
    downloadAll,
    downloadOne,
    reset,
  };
}
