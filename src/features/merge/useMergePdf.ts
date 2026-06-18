import { useCallback, useState } from 'react';
import { mergePdfs } from '@/shared/lib/pdf/mergePdf';
import { getPageCount } from '@/shared/lib/pdf/pdfLibClient';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { useDownload } from '@/shared/hooks/useDownload';
import { readFileAsUint8Array } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isPdfFile } from '@/shared/lib/validation';
import type { PdfFileItem } from '@/shared/types';

function createId(): string {
  return crypto.randomUUID();
}

export function useMergePdf() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<Uint8Array>();
  const { downloadPdf } = useDownload();

  const addFiles = useCallback(async (incoming: File[]) => {
    setError(null);
    try {
      const items: PdfFileItem[] = [];
      for (const file of incoming) {
        if (!isPdfFile(file)) {
          throw new Error(`"${file.name}" não é um PDF.`);
        }
        assertMaxSize(file);
        const bytes = await readFileAsUint8Array(file);
        const pageCount = await getPageCount(bytes);
        items.push({ id: createId(), file, bytes, pageCount });
      }
      setFiles((prev) => [...prev, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ficheiros.');
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((id: string, direction: 'up' | 'down') => {
    setFiles((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index === -1) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    setError(null);
    try {
      const result = await task.run(async () => mergePdfs(files.map((f) => f.bytes)));
      downloadPdf(result, 'merged.pdf');
    } catch {
      // handled by task
    }
  }, [files, task, downloadPdf]);

  const reset = useCallback(() => {
    setFiles([]);
    setError(null);
    task.reset();
  }, [task]);

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount ?? 0), 0);

  return {
    files,
    totalPages,
    error: error ?? task.error,
    status: task.status,
    addFiles,
    removeFile,
    moveFile,
    merge,
    reset,
  };
}
