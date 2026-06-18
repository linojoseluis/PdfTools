export type AsyncStatus = 'idle' | 'processing' | 'success' | 'error';

export type PdfFileItem = {
  id: string;
  file: File;
  bytes: Uint8Array;
  pageCount?: number;
};

export type ImageFileItem = {
  id: string;
  file: File;
  bytes: Uint8Array;
  mime: string;
  previewUrl: string;
};
