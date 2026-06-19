import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useDownload } from '@/shared/hooks/useDownload';

type MergeDownloadState = {
  pdfBytes: Uint8Array;
  filename: string;
};

export function MergeDownloadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloadPdf } = useDownload();
  const state = location.state as MergeDownloadState | null;

  useEffect(() => {
    if (!state?.pdfBytes) {
      navigate('/merge', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.pdfBytes) {
    return null;
  }

  const handleDownload = () => {
    downloadPdf(state.pdfBytes, state.filename);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Ficheiro pronto</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-lg font-medium text-slate-900">PDF criado com sucesso</p>
        <p className="mt-1 text-sm text-slate-600">
          O seu ficheiro <span className="font-medium">{state.filename}</span> está pronto para
          descarregar.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="blue" size="lg" onClick={handleDownload}>
            Descarregar
          </Button>
          <Link to="/merge">
            <Button variant="secondary" size="lg">
              Juntar mais ficheiros
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
