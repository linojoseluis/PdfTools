import { FileDropzone } from '@/shared/components/pdf/FileDropzone';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { ToolLayout } from '@/shared/components/layout/ToolLayout';
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
    <ToolLayout
      title="Imagens para PDF"
      description="Converta imagens num único documento PDF. A ordem das imagens define a ordem das páginas."
    >
      <div className="space-y-6">
        <FileDropzone
          accept={imageAccept}
          multiple
          label="Arraste imagens para aqui"
          hint="PNG, JPEG ou WebP — máx. 100 MB por ficheiro"
          onFilesAccepted={addImages}
        />

        {error && <Alert variant="error">{error}</Alert>}

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">{images.length} imagem(ns)</p>
              <Button variant="ghost" size="sm" onClick={reset}>
                Limpar
              </Button>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, index) => (
                <li
                  key={img.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{img.file.name}</p>
                    <p className="text-xs text-slate-500">
                      Página {index + 1} · {formatFileSize(img.file.size)}
                    </p>
                    <div className="mt-1 flex gap-1">
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

            <Button onClick={convert} disabled={status === 'processing'}>
              Criar PDF
            </Button>
          </div>
        )}
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A criar PDF…" />
    </ToolLayout>
  );
}
