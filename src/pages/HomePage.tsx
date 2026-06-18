import { TOOLS } from '@/shared/constants/tools';
import { ToolCard } from '@/shared/components/layout/ToolCard';

export function HomePage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Ferramentas PDF simples e gratuitas
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Processe os seus documentos diretamente no browser — rápido, privado e sem enviar
            ficheiros para servidores.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Todas as ferramentas</h2>
              <p className="mt-1 text-sm text-slate-600">
                Escolha uma ferramenta para começar a trabalhar com os seus PDFs.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
