import { FileDropzone } from '@/shared/components/pdf/FileDropzone';
import { ProcessingOverlay } from '@/shared/components/pdf/ProcessingOverlay';
import { ToolLayout } from '@/shared/components/layout/ToolLayout';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { formatFileSize } from '@/shared/lib/validation';
import { useMergePdf } from './useMergePdf';

const pdfAccept = { 'application/pdf': ['.pdf'] };

export function MergePage() {
  const {
    files,
    totalPages,
    error,
    status,
    addFiles,
    removeFile,
    moveFile,
    merge,
    reset,
  } = useMergePdf();

  return (
    <ToolLayout
      title="Juntar PDFs"
      description="Combine vários PDFs num único documento. Reordene os ficheiros antes de juntar."
    >
      <div className="space-y-6">
        <FileDropzone
          accept={pdfAccept}
          multiple
          label="Arraste PDFs para aqui"
          hint="Máx. 100 MB por ficheiro"
          onFilesAccepted={addFiles}
        />

        {error && <Alert variant="error">{error}</Alert>}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {files.length} ficheiro(s) · {totalPages} página(s) no total
              </p>
              <Button variant="ghost" size="sm" onClick={reset}>
                Limpar
              </Button>
            </div>

            <ul className="space-y-2">
              {files.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-50 text-sm font-bold text-red-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{item.file.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.pageCount} página(s) · {formatFileSize(item.file.size)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveFile(item.id, 'up')}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === files.length - 1}
                      onClick={() => moveFile(item.id, 'down')}
                    >
                      ↓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(item.id)}>
                      Remover
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <Button onClick={merge} disabled={status === 'processing'}>
              Juntar PDFs
            </Button>
          </div>
        )}
      </div>

      <ProcessingOverlay visible={status === 'processing'} message="A juntar PDFs…" />
    </ToolLayout>
  );
}
