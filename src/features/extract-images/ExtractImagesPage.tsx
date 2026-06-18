import { FileDropzone } from '@/shared/components/pdf/FileDropzone';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { ToolLayout } from '@/shared/components/layout/ToolLayout';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { useExtractImages } from './useExtractImages';

const pdfAccept = { 'application/pdf': ['.pdf'] };

export function ExtractImagesPage() {
  const {
    images,
    includeRendered,
    error,
    status,
    progress,
    setIncludeRendered,
    loadAndExtract,
    downloadAll,
    downloadOne,
    reset,
  } = useExtractImages();

  return (
    <ToolLayout
      title="Extrair imagens"
      description="Extraia imagens embutidas do PDF. Se nenhuma for encontrada, as páginas podem ser renderizadas como imagens."
    >
      <div className="space-y-6">
        <FileDropzone
          accept={pdfAccept}
          label="Arraste um PDF para aqui"
          hint="Máx. 100 MB"
          disabled={status === 'processing'}
          onFilesAccepted={(files) => loadAndExtract(files[0])}
        />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeRendered}
            onChange={(e) => setIncludeRendered(e.target.checked)}
            disabled={status === 'processing'}
          />
          Incluir render de páginas quando não houver imagens embutidas
        </label>

        {status === 'processing' && (
          <ProgressBar value={progress} label="A analisar PDF…" />
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">{images.length} imagem(ns) encontrada(s)</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={downloadAll}>
                  Descarregar ZIP
                </Button>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Limpar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, index) => (
                <div
                  key={`${img.pageNumber}-${img.index}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    src={URL.createObjectURL(img.blob)}
                    alt={`Página ${img.pageNumber}`}
                    className="aspect-video w-full bg-slate-100 object-contain"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                  <div className="flex items-center justify-between p-3">
                    <div className="text-xs text-slate-500">
                      <p>
                        Página {img.pageNumber} · {img.width}×{img.height}
                      </p>
                      <p className="capitalize">{img.source === 'embedded' ? 'Embutida' : 'Renderizada'}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => downloadOne(img, index)}>
                      Descarregar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A extrair imagens…" />
    </ToolLayout>
  );
}
