import React from 'react';

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: 'section' | 'div';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SectionContainer({
  children,
  as: Component = 'section',
  maxWidth = 'xl',
  padding = 'lg',
  className = '',
  ...props
}: SectionContainerProps) {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-6xl',
    full: 'w-full',
  };

  const paddings = {
    sm: 'px-4 py-6',
    md: 'px-4 py-8',
    lg: 'px-4 py-12',
    xl: 'px-4 py-16',
  };

  return (
    <Component
      className={`w-full mx-auto ${maxWidths[maxWidth]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

SectionContainer.displayName = 'SectionContainer';
