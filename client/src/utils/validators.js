// utils/validators.js - Funciones de validación del formulario

/**
 * Valida que el correo sea institucional de la Universidad de Lima
 */
export const isValidUlimaEmail = (email) => {
  return email.endsWith('@aloe.ulima.edu.pe');
};

/**
 * Valida el formato del código universitario
 * - 8 dígitos exactos
 * - Solo números
 */
export const isValidStudentCode = (code) => {
  return /^\d{8}$/.test(code);
};

/**
 * Valida la contraseña mínima
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Obtiene el año de ingreso del código universitario
 */
export const getEntryYear = (studentCode) => {
  if (studentCode && studentCode.length >= 4) {
    return studentCode.substring(0, 4);
  }
  return '';
};

/**
 * Lista de carreras disponibles en la Universidad de Lima
 */
export const CAREERS = [
  'Administración',
  'Arquitectura',
  'Ciencias de la Comunicación',
  'Contabilidad y Finanzas',
  'Derecho',
  'Economía',
  'Ingeniería Ambiental',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Mecatrónica',
  'Ingeniería de Sistemas',
  'Marketing',
  'Negocios Internacionales',
  'Psicología',
];

/**
 * Ciclos académicos disponibles
 */
export const CYCLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

/**
 * Genera iniciales del nombre para avatar por defecto
 */
export const getInitials = (name, lastName) => {
  const first = name ? name.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};
