import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const baseClasses = 'w-full rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
    const normalClasses = 'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800';
    const errorClasses = 'border-error-500 dark:border-error-500 focus:ring-error-500 focus:border-error-500';
    
    const inputClasses = [
      baseClasses,
      error ? errorClasses : normalClasses,
      className,
    ].join(' ');
    
    const id = props.id || props.name || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className="mb-4">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <input
          id={id}
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;