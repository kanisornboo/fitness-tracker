import React, { useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: SelectOption[];
  className?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
  'aria-describedby'?: string;
}

export default function Select({ label, value, onChange, options = [], className = '', required = false, placeholder = 'Select an option', id: externalId, 'aria-describedby': ariaDescribedby }: SelectProps) {
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
      <div className='relative'>
        <select
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          required={required}
          aria-required={required || undefined}
          aria-describedby={ariaDescribedby}
          className='w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all duration-200 cursor-pointer'
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon aria-hidden="true" className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none' />
      </div>
    </div>
  );
}
