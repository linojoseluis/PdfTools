type ToolLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-slate-600">{description}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
    </div>
  );
}
