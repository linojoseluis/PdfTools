import { Link } from 'react-router-dom';
import type { ToolDefinition } from '@/shared/constants/tools';

type ToolCardProps = {
  tool: ToolDefinition;
};

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.path}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <span
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${tool.accentBg}`}
      >
        <Icon className={`h-6 w-6 ${tool.accent}`} />
      </span>
      <h2 className="text-lg font-semibold text-slate-900">{tool.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
      <span className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${tool.accent}`}>
        Abrir ferramenta
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 12l4-4-4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
