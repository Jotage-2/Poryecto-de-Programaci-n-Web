// utils/cryptoUtils.js - Utilidades de criptografía
import { createHash } from 'crypto';

/**
 * Hash simple de contraseña usando SHA-256 sin salt
 * NOTA IMPORTANTE: En un sistema en producción SIEMPRE se debe usar
 * bcrypt con salt para mayor seguridad. Esto es solo para el proyecto universitario.
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Hash hexadecimal SHA-256
 */
export const hashPassword = (password) => {
  return createHash('sha256').update(password).digest('hex');
};

/**
 * Compara una contraseña en texto plano con su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {boolean} True si coinciden
 */
export const comparePassword = (password, hash) => {
  const hashedInput = hashPassword(password);
  return hashedInput === hash;
};

/**
 * Genera un código de verificación aleatorio de 6 dígitos
 * @returns {string} Código de 6 dígitos
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
