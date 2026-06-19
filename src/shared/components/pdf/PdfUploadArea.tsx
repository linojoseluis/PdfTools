import { useDropzone, type Accept } from 'react-dropzone';
import { clsx } from 'clsx';
import { Button } from '@/shared/components/ui/Button';

type PdfUploadAreaProps = {
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  hint?: string;
  selectButtonLabel?: string;
  onFilesAccepted: (files: File[]) => void;
  onReject?: (message: string) => void;
  disabled?: boolean;
};

export function PdfUploadArea({
  accept,
  multiple = false,
  label = 'Arraste ficheiros PDF para aqui',
  hint,
  selectButtonLabel = 'Selecionar ficheiros',
  onFilesAccepted,
  onReject,
  disabled = false,
}: PdfUploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept,
    multiple,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        onReject?.('Tipo de ficheiro não suportado.');
        return;
      }
      if (accepted.length > 0) {
        onFilesAccepted(accepted);
      }
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          'rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          disabled && 'cursor-not-allowed opacity-50',
          isDragReject && 'border-red-400 bg-red-50',
          isDragActive && !isDragReject && 'border-orange-400 bg-orange-50',
          !isDragActive && !isDragReject && 'border-slate-300 bg-white',
        )}
      >
        <input {...getInputProps()} />
        <p className="text-base font-medium text-slate-700">{label}</p>
        {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="orange" size="lg" disabled={disabled} onClick={open}>
          {selectButtonLabel}
        </Button>
      </div>
    </div>
  );
}
