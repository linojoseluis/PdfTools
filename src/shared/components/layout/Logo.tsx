import { Link } from 'react-router-dom';

const GRID_COLORS = [
  '#FF6B6B',
  '#FFA94D',
  '#FFD43B',
  '#69DB7C',
  '#38D9A9',
  '#4DABF7',
  '#748FFC',
  '#DA77F2',
  '#FF8787',
  '#FFC078',
  '#8CE99A',
  '#91A7FF',
];

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {GRID_COLORS.map((color, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          return (
            <rect
              key={index}
              x={col * 10 + 1}
              y={row * 10 + 1}
              width="8"
              height="8"
              rx="1.5"
              fill={color}
            />
          );
        })}
      </svg>
      <span className="text-[17px] font-bold tracking-tight text-slate-900">PDF Tools</span>
    </Link>
  );
}
