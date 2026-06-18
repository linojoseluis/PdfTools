type ProcessingOverlayProps = {
  visible: boolean;
  message?: string;
};

export function ProcessingOverlay({ visible, message = 'A processar…' }: ProcessingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-xl bg-white px-8 py-6 shadow-xl">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
        <p className="text-center text-sm font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
}
