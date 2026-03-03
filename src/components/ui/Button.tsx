'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
    secondary:
      'border border-border text-text-secondary hover:bg-bg-hover focus:ring-border-focus',
    danger:
      'bg-danger text-white hover:bg-danger/90 focus:ring-danger',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
