import { PDFDocument } from 'pdf-lib';

export async function loadPdfDocument(bytes: Uint8Array): Promise<PDFDocument> {
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

export async function getPageCount(bytes: Uint8Array): Promise<number> {
  const doc = await loadPdfDocument(bytes);
  return doc.getPageCount();
}
