import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface BaseInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

type InputFieldProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };

export const Input = ({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputFieldProps) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          className={`input-field ${icon ? 'has-icon' : ''} ${className}`}
          {...props}
        />
        {icon && <span className="input-icon">{icon}</span>}
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <textarea
        className={`input-field textarea ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  className = '',
  children,
  ...props
}: SelectProps) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <select className={`input-field select ${className}`} {...props}>
        {children}
      </select>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
