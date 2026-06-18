import { useCallback, useState } from 'react';
import {
  extractPages,
  splitIntoSinglePages,
  parsePageRange,
} from '@/shared/lib/pdf/extractPages';
import { getPageCount } from '@/shared/lib/pdf/pdfLibClient';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { useDownload } from '@/shared/hooks/useDownload';
import { readFileAsUint8Array } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isPdfFile } from '@/shared/lib/validation';

export type OutputMode = 'single' | 'zip';

export function useExtractPages() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState('');
  const [outputMode, setOutputMode] = useState<OutputMode>('single');
  const [lastClicked, setLastClicked] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<void>();
  const { downloadPdf, downloadZip } = useDownload();

  const loadPdf = useCallback(async (file: File) => {
    setError(null);
    try {
      if (!isPdfFile(file)) throw new Error('Selecione um ficheiro PDF.');
      assertMaxSize(file);
      const bytes = await readFileAsUint8Array(file);
      const count = await getPageCount(bytes);
      setPdfBytes(bytes);
      setFileName(file.name.replace(/\.pdf$/i, ''));
      setPageCount(count);
      setSelectedPages(new Set());
      setRangeInput('');
      task.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar PDF.');
    }
  }, [task]);

  const togglePage = useCallback(
    (pageNumber: number, shiftKey: boolean) => {
      setSelectedPages((prev) => {
        const next = new Set(prev);
        if (shiftKey && lastClicked !== null) {
          const start = Math.min(lastClicked, pageNumber);
          const end = Math.max(lastClicked, pageNumber);
          for (let p = start; p <= end; p += 1) next.add(p);
        } else if (next.has(pageNumber)) {
          next.delete(pageNumber);
        } else {
          next.add(pageNumber);
        }
        return next;
      });
      setLastClicked(pageNumber);
    },
    [lastClicked],
  );

  const selectAll = useCallback(() => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  }, [pageCount]);

  const selectNone = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  const applyRange = useCallback(() => {
    const { indices, invalidTokens } = parsePageRange(rangeInput, pageCount);
    if (invalidTokens.length > 0) {
      setError(`Intervalo inválido: ${invalidTokens.join(', ')}`);
      return;
    }
    setError(null);
    setSelectedPages(new Set(indices.map((i) => i + 1)));
  }, [rangeInput, pageCount]);

  const extract = useCallback(async () => {
    if (!pdfBytes) return;
    setError(null);

    const indices = [...selectedPages].sort((a, b) => a - b).map((p) => p - 1);
    if (indices.length === 0) {
      setError('Selecione pelo menos uma página.');
      return;
    }

    try {
      await task.run(async (report) => {
        if (outputMode === 'single') {
          report(50);
          const result = await extractPages(pdfBytes, indices);
          downloadPdf(result, `${fileName}-extracted.pdf`);
        } else if (indices.length === pageCount) {
          report(30);
          const pages = await splitIntoSinglePages(pdfBytes);
          report(80);
          await downloadZip(
            pages.map((p) => ({
              name: `${fileName}-page-${p.pageNumber}.pdf`,
              data: p.bytes,
            })),
            `${fileName}-pages.zip`,
          );
        } else {
          report(20);
          const files: { name: string; data: Uint8Array }[] = [];
          let done = 0;
          for (const index of indices) {
            const bytes = await extractPages(pdfBytes, [index]);
            files.push({ name: `${fileName}-page-${index + 1}.pdf`, data: bytes });
            done += 1;
            report(20 + (done / indices.length) * 70);
          }
          await downloadZip(files, `${fileName}-pages.zip`);
        }
        report(100);
      });
    } catch {
      // handled by task
    }
  }, [pdfBytes, selectedPages, outputMode, fileName, pageCount, task, downloadPdf, downloadZip]);

  const reset = useCallback(() => {
    setPdfBytes(null);
    setFileName('');
    setPageCount(0);
    setSelectedPages(new Set());
    setRangeInput('');
    setError(null);
    task.reset();
  }, [task]);

  return {
    pdfBytes,
    pageCount,
    selectedPages,
    rangeInput,
    outputMode,
    error: error ?? task.error,
    status: task.status,
    progress: task.progress,
    loadPdf,
    togglePage,
    selectAll,
    selectNone,
    applyRange,
    setRangeInput,
    setOutputMode,
    extract,
    reset,
  };
}
