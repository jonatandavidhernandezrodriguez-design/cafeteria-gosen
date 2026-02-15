import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl transition-all duration-200';

  const variants = {
    default: 'bg-white border border-gray-200 shadow-soft hover:shadow-soft-md',
    elevated: 'bg-white shadow-soft-md hover:shadow-soft-lg',
    outlined: 'bg-gray-50 border border-gray-100',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';
