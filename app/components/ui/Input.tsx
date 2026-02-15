import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  icon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error = false,
  icon,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const baseStyles = 'w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium text-base';

  const variants = error
    ? 'border-red-500 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100'
    : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`${baseStyles} ${variants} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

Input.displayName = 'Input';
