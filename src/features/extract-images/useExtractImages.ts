import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  extractImagesFromPdf,
  getImageFileExtension,
  type ImageOutputFormat,
} from '@/shared/lib/pdf/extractImages';
import { createZipBytes } from '@/shared/lib/download';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { readFileAsArrayBuffer } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isPdfFile } from '@/shared/lib/validation';

const DEFAULT_DPI = 144;
const DEFAULT_QUALITY = 85;

export function useExtractImages() {
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<ImageOutputFormat>('jpeg');
  const [dpi, setDpi] = useState(DEFAULT_DPI);
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<void>();
  const navigate = useNavigate();

  const loadFile = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const file = files[0];
      setError(null);

      try {
        if (!isPdfFile(file)) throw new Error('Selecione um ficheiro PDF.');
        assertMaxSize(file);
        const buffer = await readFileAsArrayBuffer(file);
        setPdfBuffer(buffer);
        setFileName(file.name.replace(/\.pdf$/i, ''));
        task.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar PDF.');
      }
    },
    [task],
  );

  const extract = useCallback(async () => {
    if (!pdfBuffer) {
      setError('Carregue um ficheiro PDF primeiro.');
      return;
    }

    if (dpi <= 0) {
      setError('Introduza um valor de DPI válido.');
      return;
    }

    if (quality < 1 || quality > 100) {
      setError('A qualidade deve estar entre 1 e 100.');
      return;
    }

    setError(null);

    try {
      await task.run(async (report) => {
        const images = await extractImagesFromPdf(pdfBuffer, {
          format,
          dpi,
          quality,
          onProgress: (current, total) => {
            report(Math.round((current / total) * 80));
          },
        });

        if (images.length === 0) {
          throw new Error('Nenhuma imagem encontrada neste PDF.');
        }

        const extension = getImageFileExtension(format);
        const zipBytes = await createZipBytes(
          images.map((image, index) => ({
            name: `${fileName}-p${image.pageNumber}-${image.source}-${index + 1}.${extension}`,
            data: image.blob,
          })),
        );

        report(100);

        navigate('/extract-images/download', {
          state: {
            zipBytes,
            filename: `${fileName}-images.zip`,
          },
        });
      });
    } catch {
      // handled by task
    }
  }, [pdfBuffer, fileName, format, dpi, quality, task, navigate]);

  const reset = useCallback(() => {
    setPdfBuffer(null);
    setFileName('');
    setFormat('jpeg');
    setDpi(DEFAULT_DPI);
    setQuality(DEFAULT_QUALITY);
    setError(null);
    task.reset();
  }, [task]);

  return {
    pdfBuffer,
    fileName,
    format,
    dpi,
    quality,
    error: error ?? task.error,
    status: task.status,
    progress: task.progress,
    setFormat,
    setDpi,
    setQuality,
    loadFile,
    extract,
    reset,
  };
}
