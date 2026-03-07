import React, { useId } from 'react';

interface InputProps {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  id?: string;
  'aria-describedby'?: string;
}

export default function Input({ label, type = 'text', value, onChange, placeholder = '', className = '', required = false, min, max, id: externalId, 'aria-describedby': ariaDescribedby }: InputProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
          {label}
          {required && (
            <>
              <span aria-hidden="true" className='text-red-500 ml-1'>*</span>
              <span className='sr-only'> (required)</span>
            </>
          )}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        aria-describedby={ariaDescribedby}
        min={min}
        max={max}
        className='w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all duration-200'
      />
    </div>
  );
}
