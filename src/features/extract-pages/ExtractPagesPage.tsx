import { PageThumbnail } from '@/shared/components/pdf/PageThumbnail';
import { FileDropzone } from '@/shared/components/pdf/FileDropzone';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { ToolLayout } from '@/shared/components/layout/ToolLayout';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { useExtractPages } from './useExtractPages';

const pdfAccept = { 'application/pdf': ['.pdf'] };

export function ExtractPagesPage() {
  const {
    pdfBytes,
    pageCount,
    selectedPages,
    rangeInput,
    outputMode,
    error,
    status,
    progress,
    loadPdf,
    togglePage,
    selectAll,
    selectNone,
    applyRange,
    setRangeInput,
    setOutputMode,
    extract,
    reset,
  } = useExtractPages();

  return (
    <ToolLayout
      title="Extrair páginas"
      description="Selecione páginas de um PDF e exporte como um único ficheiro ou um ZIP com páginas individuais."
    >
      <div className="space-y-6">
        {!pdfBytes ? (
          <FileDropzone
            accept={pdfAccept}
            label="Arraste um PDF para aqui"
            hint="Um ficheiro de cada vez — máx. 100 MB"
            onFilesAccepted={(files) => loadPdf(files[0])}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-600">
                {pageCount} página(s) · {selectedPages.size} selecionada(s)
              </p>
              <Button variant="ghost" size="sm" onClick={reset}>
                Trocar PDF
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={selectAll}>
                Todas
              </Button>
              <Button variant="secondary" size="sm" onClick={selectNone}>
                Nenhuma
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="Ex: 1-3, 5, 7-9"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <Button variant="secondary" size="sm" onClick={applyRange}>
                Aplicar intervalo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
                <PageThumbnail
                  key={pageNum}
                  data={pdfBytes}
                  pageNumber={pageNum}
                  selected={selectedPages.has(pageNum)}
                  onClick={togglePage}
                />
              ))}
            </div>

            <div className="space-y-3 rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">Modo de exportação</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="outputMode"
                  checked={outputMode === 'single'}
                  onChange={() => setOutputMode('single')}
                />
                Um PDF com páginas selecionadas
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="outputMode"
                  checked={outputMode === 'zip'}
                  onChange={() => setOutputMode('zip')}
                />
                Um PDF por página (ZIP)
              </label>
            </div>

            {status === 'processing' && (
              <ProgressBar value={progress} label="A extrair páginas…" />
            )}

            <Button
              onClick={extract}
              disabled={status === 'processing' || selectedPages.size === 0}
            >
              Extrair páginas
            </Button>
          </>
        )}

        {error && <Alert variant="error">{error}</Alert>}
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A extrair páginas…" />
    </ToolLayout>
  );
}
