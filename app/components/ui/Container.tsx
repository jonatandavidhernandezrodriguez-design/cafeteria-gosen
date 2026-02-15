import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

Container.displayName = 'Container';
