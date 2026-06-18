import { useCallback } from 'react';

export async function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function useFileReader() {
  const readAsUint8Array = useCallback(async (file: File) => readFileAsUint8Array(file), []);
  const readAsArrayBuffer = useCallback(async (file: File) => readFileAsArrayBuffer(file), []);

  return { readAsUint8Array, readAsArrayBuffer };
}
