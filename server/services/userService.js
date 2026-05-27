// services/userService.js - Lógica de negocio para usuarios
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const USERS_FILE = join(__dirname, '../data/users.json');

// ============================================================
// FUNCIONES DE ACCESO A DATOS
// ============================================================

/**
 * Lee todos los usuarios del JSON
 */
export const getAllUsers = () => {
  try {
    const data = readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * Guarda la lista de usuarios
 */
export const saveUsers = (users) => {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

/**
 * Hash SHA-256 sin salt (solo para proyecto universitario)
 * En producción: usar bcrypt con salt rounds
 */
export const hashPassword = (password) => {
  return createHash('sha256').update(password).digest('hex');
};

/**
 * Genera código de verificación de 6 dígitos
 */
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================================
// OPERACIONES DE USUARIO
// ============================================================

/**
 * Busca usuario por email o código universitario
 */
export const findUser = (identifier) => {
  const users = getAllUsers();
  return users.find(
    (u) => u.email === identifier || u.studentCode === identifier
  );
};

/**
 * Busca usuario por email
 */
export const findUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find((u) => u.email === email);
};

/**
 * Crea un nuevo usuario
 */
export const createUser = (userData) => {
  const users = getAllUsers();

  // Verificar duplicados
  const existingEmail = users.find((u) => u.email === userData.email);
  if (existingEmail) throw new Error('Ya existe una cuenta con ese correo institucional');

  const existingCode = users.find((u) => u.studentCode === userData.studentCode);
  if (existingCode) throw new Error('Ya existe una cuenta con ese código universitario');

  const verificationCode = generateCode();
  const newUser = {
    id: uuidv4(),
    name: userData.name,
    lastName: userData.lastName,
    studentCode: userData.studentCode,
    entryYear: userData.studentCode.substring(0, 4),
    email: userData.email,
    password: hashPassword(userData.password),
    career: userData.career,
    cycle: userData.cycle,
    profilePicture: userData.profilePicture || '',
    verificationCode,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { user: newUser, verificationCode };
};

/**
 * Verifica la cuenta de un usuario con su código
 */
export const verifyUserAccount = (email, code) => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) throw new Error('Usuario no encontrado');

  const user = users[index];
  if (user.verified) throw new Error('La cuenta ya está verificada');
  if (user.verificationCode !== code) throw new Error('Código de verificación incorrecto');

  // Marcar como verificado y limpiar el código
  users[index].verified = true;
  users[index].verificationCode = '';
  saveUsers(users);

  return users[index];
};

/**
 * Genera y guarda un nuevo código de verificación
 */
export const regenerateVerificationCode = (email) => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) throw new Error('Usuario no encontrado');
  if (users[index].verified) throw new Error('La cuenta ya está verificada');

  const newCode = generateCode();
  users[index].verificationCode = newCode;
  saveUsers(users);

  return { code: newCode, user: users[index] };
};

/**
 * Genera código de recuperación de contraseña
 */
export const setPasswordResetCode = (email) => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) throw new Error('No existe una cuenta con ese correo');

  const resetCode = generateCode();
  users[index].verificationCode = resetCode;
  saveUsers(users);

  return { code: resetCode, user: users[index] };
};

/**
 * Valida código de recuperación y actualiza contraseña
 */
export const resetPassword = (email, code, newPassword) => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) throw new Error('Usuario no encontrado');
  if (users[index].verificationCode !== code) throw new Error('Código de recuperación incorrecto');

  users[index].password = hashPassword(newPassword);
  users[index].verificationCode = '';
  saveUsers(users);

  return users[index];
};

/**
 * Autentica un usuario (por email o código universitario)
 */
export const authenticateUser = (identifier, password) => {
  const user = findUser(identifier);

  if (!user) throw new Error('Usuario no encontrado. Verifica tus credenciales');
  if (!user.verified) throw new Error('Debes verificar tu correo institucional antes de iniciar sesión');
  if (user.password !== hashPassword(password)) throw new Error('Contraseña incorrecta');

  // Retornar usuario sin contraseña ni código
  const { password: _, verificationCode: __, ...safeUser } = user;
  return safeUser;
};
