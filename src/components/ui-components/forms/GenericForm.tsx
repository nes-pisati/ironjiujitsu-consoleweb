import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useCallback, type ReactNode } from 'react';

// Interfacce 
export interface FieldConfig<T = any> {
  name: keyof T & string; 
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | undefined;
  options?: { value: string | number; label: string }[]; 
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormProps<T> {
  fields: FieldConfig<T>[];
  initialValues: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel?: string;
  layout?: ReactNode;
}

// Hook gestione stato form
function useForm<T extends Record<string, any>>(
  initialValues: Partial<T>,
  fields: FieldConfig<T>[]
) {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    fields.forEach(field => {
      const value = values[field.name];
      
      // Validazione required
      if (field.required && (!value || value === '')) {
        newErrors[field.name as string] = `${field.label} è obbligatorio`;
        return;
      }
      
      // Validazione personalizzata
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name as string] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, fields]);

  const updateValue = useCallback((name: keyof T & string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    validate,
    updateValue
  };
}

// Componente Field modulare
interface FieldProps<T> {
  config: FieldConfig<T>;
  value: any;
  error?: string;
  onChange: (name: keyof T & string, value: any) => void; 
  className?: string;
}

function Field<T>({ config, value, error, onChange, className = '' }: FieldProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = config.type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(config.name, newValue);
  };

  const baseInputClasses = `
    w-full p-3 border rounded-xl text-sm text-gray-500 
    ${error ? 'border-red-500' : 'border-gray-300'}
  `;

  const renderInput = () => {
    switch (config.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={handleChange}
            placeholder={config.placeholder}
            className={`${baseInputClasses} h-24 resize-vertical`}
            required={config.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={handleChange}
            className={baseInputClasses}
            required={config.required}
          >
            <option value="">Seleziona...</option>
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={config.type}
            value={value || ''}
            onChange={handleChange}
            placeholder={config.placeholder}
            className={baseInputClasses}
            required={config.required}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-semibold pb-1 font-medium text-gray-700 mb-1">
        {config.label}
        {config.required && <span className="text-black ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Componente Form 
export function ModularForm<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  submitLabel = 'Invia',
  layout
}: FormProps<T>) {
  const { values, errors, isSubmitting, setIsSubmitting, validate, updateValue } = useForm(
    initialValues,
    fields
  );

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values as T);
    } catch (error) {
      console.error('Errore durante submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (layout) {
    return (
      <div className="space-y-4">
        {React.cloneElement(layout as React.ReactElement<any>, {
          fields,
          values,
          errors,
          updateValue,
          Field
        })}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-black text-white text-base font-semibold py-4 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-8 hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faSave} size='sm'/>
          {isSubmitting ? 'Invio...' : submitLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <Field
          key={String(field.name)}
          config={field}
          value={values[field.name] ?? ''}
          error={errors[field.name]}
          onChange={updateValue}
        />
      ))}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-black text-white text-xl font-semibold py-4 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-8 hover:cursor-pointer"
      >
        <FontAwesomeIcon icon={faSave} size='lg'/>
        {isSubmitting ? 'Invio...' : submitLabel}
      </button>
    </div>
  );
}
