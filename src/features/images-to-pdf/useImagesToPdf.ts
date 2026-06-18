import { useCallback, useState } from 'react';
import { imagesToPdf } from '@/shared/lib/pdf/imagesToPdf';
import { useAsyncTask } from '@/shared/hooks/useAsyncTask';
import { useDownload } from '@/shared/hooks/useDownload';
import { readFileAsUint8Array } from '@/shared/hooks/useFileReader';
import { assertMaxSize, isImageFile } from '@/shared/lib/validation';
import type { ImageFileItem } from '@/shared/types';

function createId(): string {
  return crypto.randomUUID();
}

export function useImagesToPdf() {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const task = useAsyncTask<Uint8Array>();
  const { downloadPdf } = useDownload();

  const addImages = useCallback(async (files: File[]) => {
    setError(null);
    try {
      const items: ImageFileItem[] = [];
      for (const file of files) {
        if (!isImageFile(file)) {
          throw new Error(`"${file.name}" não é uma imagem suportada.`);
        }
        assertMaxSize(file);
        const bytes = await readFileAsUint8Array(file);
        items.push({
          id: createId(),
          file,
          bytes,
          mime: file.type || 'image/jpeg',
          previewUrl: URL.createObjectURL(file),
        });
      }
      setImages((prev) => [...prev, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar imagens.');
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const moveImage = useCallback((id: string, direction: 'up' | 'down') => {
    setImages((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index === -1) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const convert = useCallback(async () => {
    setError(null);
    try {
      const result = await task.run(async () => {
        return imagesToPdf(images.map((img) => ({ bytes: img.bytes, mime: img.mime })));
      });
      downloadPdf(result, 'images.pdf');
    } catch {
      // error handled by task state
    }
  }, [images, task, downloadPdf]);

  const reset = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    task.reset();
  }, [images, task]);

  return {
    images,
    error: error ?? task.error,
    status: task.status,
    progress: task.progress,
    addImages,
    removeImage,
    moveImage,
    convert,
    reset,
  };
}
