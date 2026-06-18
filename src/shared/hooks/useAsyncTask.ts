import { useCallback, useState } from 'react';
import type { AsyncStatus } from '@/shared/types';

type AsyncTaskState<T> = {
  status: AsyncStatus;
  error: string | null;
  progress: number;
  result: T | null;
};

export function useAsyncTask<T>() {
  const [state, setState] = useState<AsyncTaskState<T>>({
    status: 'idle',
    error: null,
    progress: 0,
    result: null,
  });

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null, progress: 0, result: null });
  }, []);

  const run = useCallback(async (task: (report: (value: number) => void) => Promise<T>) => {
    setState({ status: 'processing', error: null, progress: 0, result: null });

    try {
      const result = await task((value) => {
        setState((prev) => ({ ...prev, progress: value }));
      });
      setState({ status: 'success', error: null, progress: 100, result });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      setState({ status: 'error', error: message, progress: 0, result: null });
      throw err;
    }
  }, []);

  return { ...state, run, reset };
}
