import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'medium';
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  icon,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300',
  };

  const sizeStyles = {
    large: 'min-h-[64px] px-8 py-4 text-xl',
    medium: 'min-h-[56px] px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {children}
    </button>
  );
}
