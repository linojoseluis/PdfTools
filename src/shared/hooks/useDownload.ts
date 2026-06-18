import { useCallback } from 'react';
import { savePdf, saveBlob, saveZip } from '@/shared/lib/download';

export function useDownload() {
  const downloadPdf = useCallback((bytes: Uint8Array, filename = 'document.pdf') => {
    savePdf(bytes, filename);
  }, []);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    saveBlob(blob, filename);
  }, []);

  const downloadZip = useCallback(
    async (files: { name: string; data: Uint8Array | Blob }[], filename = 'archive.zip') => {
      await saveZip(files, filename);
    },
    [],
  );

  return { downloadPdf, downloadBlob, downloadZip };
}
