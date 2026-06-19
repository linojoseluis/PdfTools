import { Document, Page, pdfjs } from 'react-pdf';
import { pdfWorkerUrl } from '@/shared/lib/pdf/pdfJsClient';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PageThumbnailProps = {
  data: Uint8Array;
  pageNumber: number;
  selected?: boolean;
  onClick?: (pageNumber: number, shiftKey: boolean) => void;
};

export function PageThumbnail({ data, pageNumber, selected, onClick }: PageThumbnailProps) {
  return (
    <button
      type="button"
      onClick={(e) => onClick?.(pageNumber, e.shiftKey)}
      className={`group relative overflow-hidden rounded-lg border-2 bg-white p-2 text-left transition-all ${
        selected
          ? 'border-red-500 ring-2 ring-red-200'
          : 'border-slate-200 hover:border-red-300'
      }`}
    >
      <div className="pointer-events-none flex aspect-[3/4] items-center justify-center overflow-hidden rounded bg-slate-100">
        <Document file={{ data }} loading={<span className="text-xs text-slate-400">…</span>}>
          <Page
            pageNumber={pageNumber}
            width={120}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      <span className="mt-2 block text-center text-xs font-medium text-slate-600">
        Página {pageNumber}
      </span>
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          ✓
        </span>
      )}
    </button>
  );
}
