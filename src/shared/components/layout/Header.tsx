import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '@/shared/constants/tools';
import { Logo } from './Logo';

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-10 px-6 py-4 lg:px-10">
        <Logo />

        <nav
          className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto lg:gap-8"
          aria-label="Ferramentas PDF"
        >
          {TOOLS.map((tool) => {
            const isActive = pathname === tool.path;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`shrink-0 text-[15px] transition-colors ${
                  isActive
                    ? 'font-semibold text-slate-900'
                    : 'font-normal text-slate-600 hover:text-slate-900'
                }`}
              >
                {tool.navTitle}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
