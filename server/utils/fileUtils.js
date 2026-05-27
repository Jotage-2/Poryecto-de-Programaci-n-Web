// utils/fileUtils.js - Utilidades para manejo de archivos JSON
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo de usuarios
const USERS_FILE = join(__dirname, '../data/users.json');

/**
 * Lee todos los usuarios del archivo JSON
 * @returns {Array} Lista de usuarios
 */
export const readUsers = () => {
  try {
    const data = readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
};

/**
 * Guarda la lista de usuarios en el archivo JSON
 * @param {Array} users - Lista de usuarios a guardar
 */
export const writeUsers = (users) => {
  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando usuarios:', error);
    throw new Error('Error al guardar datos');
  }
};

/**
 * Genera un código de verificación aleatorio de 6 dígitos
 * @returns {string} Código de verificación
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash simple de contraseña usando SHA-256 (sin salt - solo para proyecto universitario)
 * NOTA: En producción siempre usar bcrypt con salt
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Hash hexadecimal
 */
export const hashPassword = (password) => {
  // Implementación simple con crypto nativo de Node.js
  const { createHash } = require('crypto');
  return createHash('sha256').update(password).digest('hex');
};
