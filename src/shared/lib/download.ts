import { saveAs } from 'file-saver';

export function savePdf(bytes: Uint8Array, filename = 'document.pdf'): void {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  saveAs(blob, filename);
}

export function saveBlob(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

export async function saveZip(
  files: { name: string; data: Uint8Array | Blob }[],
  filename = 'archive.zip',
): Promise<void> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.data);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, filename);
}
