import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function Button({
  children, variant = 'primary', size = 'md', icon, iconRight,
  loading, disabled, fullWidth, onClick, type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gold-400 text-earth-900 hover:bg-gold-500 hover:shadow-lg',
    secondary: 'bg-white text-earth-700 border border-earth-200 hover:bg-earth-50 hover:border-earth-300',
    ghost: 'text-earth-600 hover:bg-earth-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  };
  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-3.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading ? (
        <Icon name="Loader2" size={16} className="animate-spin" />
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={16} />}
    </button>
  );
}
