import { PdfUploadArea } from '@/shared/components/pdf/PdfUploadArea';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { useExtractPages, type PageSelectionMode } from './useExtractPages';

const pdfAccept = { 'application/pdf': ['.pdf'] };

const selectionOptions: { value: PageSelectionMode; label: string }[] = [
  { value: 'even', label: 'Páginas pares' },
  { value: 'odd', label: 'Páginas impares' },
  { value: 'single', label: 'Página nr' },
  { value: 'range', label: 'Intervalo de páginas' },
];

export function ExtractPagesPage() {
  const {
    pdfBytes,
    fileName,
    pageCount,
    selectionMode,
    pageNumberInput,
    rangeInput,
    error,
    status,
    progress,
    loadFiles,
    setSelectionMode,
    setPageNumberInput,
    setRangeInput,
    extract,
    reset,
  } = useExtractPages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Extrair páginas</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {!pdfBytes ? (
            <PdfUploadArea
              accept={pdfAccept}
              label="Arraste um ficheiro PDF para aqui"
              hint="Um ficheiro de cada vez — máx. 100 MB"
              onFilesAccepted={loadFiles}
              disabled={status === 'processing'}
            />
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">{fileName}.pdf</p>
                <p className="text-sm text-slate-500">{pageCount} página(s)</p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                Trocar PDF
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="page-selection" className="block text-sm font-medium text-slate-700">
              Opção de extração
            </label>
            <select
              id="page-selection"
              value={selectionMode}
              onChange={(event) => setSelectionMode(event.target.value as PageSelectionMode)}
              disabled={!pdfBytes || status === 'processing'}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {selectionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectionMode === 'single' && (
            <div className="space-y-2">
              <label htmlFor="page-number" className="block text-sm font-medium text-slate-700">
                Número da página
              </label>
              <input
                id="page-number"
                type="number"
                min={1}
                max={pageCount || undefined}
                value={pageNumberInput}
                onChange={(event) => setPageNumberInput(event.target.value)}
                placeholder="Ex: 3"
                disabled={!pdfBytes || status === 'processing'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
              />
            </div>
          )}

          {selectionMode === 'range' && (
            <div className="space-y-2">
              <label htmlFor="page-range" className="block text-sm font-medium text-slate-700">
                Intervalo de páginas
              </label>
              <input
                id="page-range"
                type="text"
                value={rangeInput}
                onChange={(event) => setRangeInput(event.target.value)}
                placeholder="Ex: 2-8"
                disabled={!pdfBytes || status === 'processing'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
              />
              <p className="text-xs text-slate-500">Formato: página início-página fim</p>
            </div>
          )}

          {pdfBytes && selectionMode === 'even' && (
            <p className="text-sm text-slate-600">
              Serão extraídas as páginas pares (2, 4, 6…) do documento com {pageCount} página(s).
            </p>
          )}

          {pdfBytes && selectionMode === 'odd' && (
            <p className="text-sm text-slate-600">
              Serão extraídas as páginas impares (1, 3, 5…) do documento com {pageCount} página(s).
            </p>
          )}

          {error && <Alert variant="error">{error}</Alert>}

          {status === 'processing' && (
            <ProgressBar value={progress} label="A extrair páginas…" />
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="green"
              size="lg"
              onClick={extract}
              disabled={!pdfBytes || status === 'processing'}
            >
              Extrair páginas
            </Button>
          </div>
        </div>
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A extrair páginas…" />
    </div>
  );
}
