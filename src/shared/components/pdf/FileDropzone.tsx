import { useDropzone, type Accept } from 'react-dropzone';
import { clsx } from 'clsx';

type FileDropzoneProps = {
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onFilesAccepted: (files: File[]) => void;
  onReject?: (message: string) => void;
  disabled?: boolean;
};

export function FileDropzone({
  accept,
  multiple = false,
  label = 'Arraste ficheiros para aqui',
  hint,
  onFilesAccepted,
  onReject,
  disabled = false,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple,
    disabled,
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
    <div
      {...getRootProps()}
      className={clsx(
        'cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        isDragReject && 'border-red-400 bg-red-50',
        isDragActive && !isDragReject && 'border-red-500 bg-red-50',
        !isDragActive && !isDragReject && 'border-slate-300 bg-white hover:border-red-400 hover:bg-slate-50',
      )}
    >
      <input {...getInputProps()} />
      <p className="text-base font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-500">ou clique para selecionar</p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
