type AlertProps = {
  variant?: 'info' | 'error' | 'success';
  children: React.ReactNode;
};

const styles = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-green-50 text-green-800 border-green-200',
};

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>{children}</div>
  );
}
