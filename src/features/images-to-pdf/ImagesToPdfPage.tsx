import { ImageUploadArea } from '@/shared/components/pdf/ImageUploadArea';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { formatFileSize } from '@/shared/lib/validation';
import { useImagesToPdf } from './useImagesToPdf';

const imageAccept = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

export function ImagesToPdfPage() {
  const {
    images,
    error,
    status,
    addImages,
    removeImage,
    moveImage,
    convert,
    reset,
  } = useImagesToPdf();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Converter imagens</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <ImageUploadArea
            accept={imageAccept}
            multiple
            hint="PNG, JPEG ou WebP — máx. 100 MB por ficheiro"
            onFilesAccepted={addImages}
            disabled={status === 'processing'}
          />

          {error && <Alert variant="error">{error}</Alert>}

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Imagens selecionadas ({images.length})
                </p>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Limpar
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img, index) => (
                  <li
                    key={img.id}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={img.previewUrl}
                        alt={img.file.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-semibold text-slate-700 shadow-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="space-y-2 p-2">
                      <p className="truncate text-xs font-medium text-slate-700">{img.file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(img.file.size)}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => moveImage(img.id, 'up')}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(img.id, 'down')}
                        >
                          ↓
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeImage(img.id)}>
                          Remover
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="green"
              size="lg"
              onClick={convert}
              disabled={status === 'processing' || images.length === 0}
            >
              Converter imagens
            </Button>
          </div>
        </div>
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A criar PDF…" />
    </div>
  );
}
