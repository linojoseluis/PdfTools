import { PDFDocument } from 'pdf-lib';

export type ImageInput = {
  bytes: Uint8Array;
  mime: string;
};

async function webpToPng(bytes: Uint8Array): Promise<Uint8Array> {
  const blob = new Blob([bytes], { type: 'image/webp' });
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível converter WebP.');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Falha na conversão WebP.'))),
      'image/png',
    );
  });

  return new Uint8Array(await pngBlob.arrayBuffer());
}

export async function imagesToPdf(images: ImageInput[]): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error('Adicione pelo menos uma imagem.');
  }

  const pdf = await PDFDocument.create();

  for (const { bytes, mime } of images) {
    let imageBytes = bytes;
    let isPng = mime.includes('png');

    if (mime.includes('webp')) {
      imageBytes = await webpToPng(bytes);
      isPng = true;
    }

    const embedded = isPng
      ? await pdf.embedPng(imageBytes)
      : await pdf.embedJpg(imageBytes);

    const { width, height } = embedded.scale(1);
    const page = pdf.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }

  return pdf.save();
}
