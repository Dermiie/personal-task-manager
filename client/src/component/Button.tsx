import type { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const baseStyles =
    'flex items-center gap-2 px-3 py-1 text-md rounded-lg cursor-pointer font-light';

  const variantStyles = {
    primary: 'bg-theme text-white hover:bg-theme-hover',
    outline: 'border border-theme text-theme bg-transparent',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}
