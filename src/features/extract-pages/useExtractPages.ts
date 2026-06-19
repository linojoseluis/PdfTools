import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  extractPages,
  getEvenPageIndices,
  getOddPageIndices,
  parsePageInterval,
  parseSinglePage,
} from '@/shared/lib/pdf/extractPages';
import { getPageCount } from '@/shared/lib/pdf/pdfLibClient';
import { createZipBytes } from '@/shared/lib/download';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { readFileAsUint8Array } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isPdfFile } from '@/shared/lib/validation';

export type PageSelectionMode = 'even' | 'odd' | 'single' | 'range';

export function useExtractPages() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [selectionMode, setSelectionMode] = useState<PageSelectionMode>('even');
  const [pageNumberInput, setPageNumberInput] = useState('');
  const [rangeInput, setRangeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<void>();
  const navigate = useNavigate();

  const loadPdf = useCallback(
    async (file: File) => {
      setError(null);
      try {
        if (!isPdfFile(file)) throw new Error('Selecione um ficheiro PDF.');
        assertMaxSize(file);
        const bytes = await readFileAsUint8Array(file);
        const count = await getPageCount(bytes);
        setPdfBytes(bytes);
        setFileName(file.name.replace(/\.pdf$/i, ''));
        setPageCount(count);
        setPageNumberInput('');
        setRangeInput('');
        task.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar PDF.');
      }
    },
    [task],
  );

  const loadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      await loadPdf(files[0]);
    },
    [loadPdf],
  );

  const resolveIndices = useCallback((): number[] => {
    if (pageCount === 0) {
      throw new Error('Carregue um ficheiro PDF primeiro.');
    }

    switch (selectionMode) {
      case 'even':
        return getEvenPageIndices(pageCount);
      case 'odd':
        return getOddPageIndices(pageCount);
      case 'single':
        return parseSinglePage(pageNumberInput, pageCount);
      case 'range':
        return parsePageInterval(rangeInput, pageCount);
      default:
        return [];
    }
  }, [selectionMode, pageCount, pageNumberInput, rangeInput]);

  const extract = useCallback(async () => {
    if (!pdfBytes) {
      setError('Carregue um ficheiro PDF primeiro.');
      return;
    }

    setError(null);

    try {
      const indices = resolveIndices();
      if (indices.length === 0) {
        setError('Não existem páginas para extrair com a opção selecionada.');
        return;
      }

      await task.run(async (report) => {
        const files: { name: string; data: Uint8Array }[] = [];

        for (let index = 0; index < indices.length; index += 1) {
          const pageIndex = indices[index];
          const bytes = await extractPages(pdfBytes, [pageIndex]);
          files.push({
            name: `${fileName}-page-${pageIndex + 1}.pdf`,
            data: bytes,
          });
          report(((index + 1) / indices.length) * 90);
        }

        const zipBytes = await createZipBytes(files);
        report(100);

        navigate('/extract-pages/download', {
          state: {
            zipBytes,
            filename: `${fileName}-pages.zip`,
          },
        });
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, [pdfBytes, fileName, resolveIndices, task, navigate]);

  const reset = useCallback(() => {
    setPdfBytes(null);
    setFileName('');
    setPageCount(0);
    setPageNumberInput('');
    setRangeInput('');
    setSelectionMode('even');
    setError(null);
    task.reset();
  }, [task]);

  return {
    pdfBytes,
    fileName,
    pageCount,
    selectionMode,
    pageNumberInput,
    rangeInput,
    error: error ?? task.error,
    status: task.status,
    progress: task.progress,
    loadFiles,
    setSelectionMode,
    setPageNumberInput,
    setRangeInput,
    extract,
    reset,
  };
}
