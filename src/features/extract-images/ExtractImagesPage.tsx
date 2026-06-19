import { PdfUploadArea } from '@/shared/components/pdf/PdfUploadArea';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import type { ImageOutputFormat } from '@/shared/lib/pdf/extractImages';
import { useExtractImages } from './useExtractImages';

const pdfAccept = { 'application/pdf': ['.pdf'] };

export function ExtractImagesPage() {
  const {
    pdfBuffer,
    fileName,
    format,
    dpi,
    quality,
    error,
    status,
    progress,
    setFormat,
    setDpi,
    setQuality,
    loadFile,
    extract,
    reset,
  } = useExtractImages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Extrair imagens</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {!pdfBuffer ? (
            <PdfUploadArea
              accept={pdfAccept}
              label="Arraste um ficheiro PDF para aqui"
              hint="Máx. 100 MB"
              selectButtonLabel="Selecionar ficheiro"
              onFilesAccepted={loadFile}
              disabled={status === 'processing'}
            />
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">{fileName}.pdf</p>
                <p className="text-sm text-slate-500">PDF carregado</p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                Trocar PDF
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="image-format" className="block text-sm font-medium text-slate-700">
                Formato
              </label>
              <select
                id="image-format"
                value={format}
                onChange={(event) => setFormat(event.target.value as ImageOutputFormat)}
                disabled={!pdfBuffer || status === 'processing'}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="image-dpi" className="block text-sm font-medium text-slate-700">
                DPI
              </label>
              <input
                id="image-dpi"
                type="number"
                min={72}
                max={600}
                value={dpi}
                onChange={(event) => setDpi(Number(event.target.value))}
                disabled={!pdfBuffer || status === 'processing'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image-quality" className="block text-sm font-medium text-slate-700">
                Qualidade (%)
              </label>
              <input
                id="image-quality"
                type="number"
                min={1}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                disabled={!pdfBuffer || status === 'processing'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          {status === 'processing' && (
            <ProgressBar value={progress} label="A extrair imagens…" />
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="green"
              size="lg"
              onClick={extract}
              disabled={!pdfBuffer || status === 'processing'}
            >
              Extrair imagens
            </Button>
          </div>
        </div>
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A extrair imagens…" />
    </div>
  );
}
