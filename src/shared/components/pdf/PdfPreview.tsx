import { Document, Page, pdfjs } from 'react-pdf';
import { pdfWorkerUrl } from '@/shared/lib/pdf/pdfJsClient';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PdfPreviewProps = {
  data: Uint8Array | ArrayBuffer;
  pageNumber?: number;
  width?: number;
  className?: string;
};

export function PdfPreview({ data, pageNumber = 1, width = 400, className }: PdfPreviewProps) {
  const [error, setError] = useState<string | null>(null);

  const fileData = data instanceof Uint8Array ? { data } : { data: new Uint8Array(data) };

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className={className}>
      <Document
        file={fileData}
        loading={<p className="text-sm text-slate-500">A carregar PDF…</p>}
        onLoadError={(err) => setError(err.message)}
      >
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
