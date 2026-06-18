import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(buffers: Uint8Array[]): Promise<Uint8Array> {
  if (buffers.length === 0) {
    throw new Error('Adicione pelo menos um ficheiro PDF.');
  }

  const merged = await PDFDocument.create();

  for (const bytes of buffers) {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}
