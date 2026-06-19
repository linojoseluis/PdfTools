import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
};

const variants = {
  primary: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  orange: 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300',
  green: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
  blue: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
