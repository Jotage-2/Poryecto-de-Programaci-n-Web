// components/common/UIComponents.jsx - Componentes reutilizables de UI

import { useState } from 'react';

// ============================================================
// BOTÓN DE CARGA
// ============================================================
export const LoadingButton = ({ loading, children, className = '', ...props }) => (
  <button
    className={`btn-primary flex items-center justify-center gap-2 ${className}`}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <>
        <span className="spinner" />
        <span>Procesando...</span>
      </>
    ) : children}
  </button>
);

// ============================================================
// CAMPO DE TEXTO
// ============================================================
export const InputField = ({
  label,
  error,
  icon: Icon,
  rightElement,
  className = '',
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`input-base ${Icon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''} ${
          error ? 'border-red-400 focus:ring-red-400' : ''
        } ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 animate-slide-in">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ============================================================
// SELECT
// ============================================================
export const SelectField = ({ label, error, options, placeholder, className = '', ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <select
      className={`input-base appearance-none cursor-pointer ${
        error ? 'border-red-400 focus:ring-red-400' : ''
      } ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-500 animate-slide-in">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ============================================================
// ALERTA / MENSAJE
// ============================================================
export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  };

  const icons = { error: '❌', success: '✅', warning: '⚠️', info: 'ℹ️' };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border text-sm animate-slide-up ${styles[type]}`}>
      <span className="text-base shrink-0">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          ✕
        </button>
      )}
    </div>
  );
};

// ============================================================
// LOGO DE ULIMASOCIAL
// ============================================================
export const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8 text-lg', text: 'text-lg' },
    md: { icon: 'w-10 h-10 text-xl', text: 'text-xl' },
    lg: { icon: 'w-14 h-14 text-2xl', text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.icon} bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-black shadow-md`}>
        U
      </div>
      {showText && (
        <span className={`${s.text} font-black logo-gradient tracking-tight`}>
          ULima<span className="text-gray-700 dark:text-gray-200">Social</span>
        </span>
      )}
    </div>
  );
};

// ============================================================
// DIVISOR CON TEXTO
// ============================================================
export const Divider = ({ text }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    {text && <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{text}</span>}
    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
  </div>
);

// ============================================================
// INPUT DE CONTRASEÑA CON TOGGLE
// ============================================================
export const PasswordInput = ({ label, error, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`input-base pr-12 ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 animate-slide-in">⚠ {error}</p>
      )}
    </div>
  );
};

// ============================================================
// TARJETA BASE (CARD)
// ============================================================
export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 ${className}`} {...props}>
    {children}
  </div>
);

// ============================================================
// MODAL BASE
// ============================================================
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
