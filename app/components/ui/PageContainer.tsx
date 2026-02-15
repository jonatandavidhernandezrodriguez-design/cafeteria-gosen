import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageContainer({
  children,
  className = '',
  title,
  description,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  );
}

PageContainer.displayName = 'PageContainer';
