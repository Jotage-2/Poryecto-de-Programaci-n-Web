// services/userService.js - Lógica de negocio para usuarios con Prisma
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Hash SHA-256 sin salt (solo para proyecto universitario)
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
// OPERACIONES DE USUARIO (PRISMA)
// ============================================================

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const findUser = async (identifier) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { studentCode: identifier }
      ]
    }
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (userData) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existingEmail) throw new Error('Ya existe una cuenta con ese correo institucional');

  const existingCode = await prisma.user.findUnique({ where: { studentCode: userData.studentCode } });
  if (existingCode) throw new Error('Ya existe una cuenta con ese código universitario');

  const verificationCode = generateCode();
  
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      lastName: userData.lastName,
      studentCode: userData.studentCode,
      email: userData.email,
      password: hashPassword(userData.password),
      career: userData.career,
      cycle: userData.cycle,
      profilePicture: userData.profilePicture || '',
      verificationCode,
      verified: false
    }
  });

  return { user: newUser, verificationCode };
};

export const verifyUserAccount = async (email, code) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');
  if (user.verified) throw new Error('La cuenta ya está verificada');
  if (user.verificationCode !== code) throw new Error('Código de verificación incorrecto');

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { verified: true, verificationCode: null }
  });

  return updatedUser;
};

export const regenerateVerificationCode = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');
  if (user.verified) throw new Error('La cuenta ya está verificada');

  const newCode = generateCode();
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { verificationCode: newCode }
  });

  return { code: newCode, user: updatedUser };
};

export const setPasswordResetCode = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('No existe una cuenta con ese correo');

  const resetCode = generateCode();
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { verificationCode: resetCode }
  });

  return { code: resetCode, user: updatedUser };
};

export const resetPassword = async (email, code, newPassword) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');
  if (user.verificationCode !== code) throw new Error('Código de recuperación incorrecto');

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { 
      password: hashPassword(newPassword),
      verificationCode: null 
    }
  });

  return updatedUser;
};

export const authenticateUser = async (identifier, password) => {
  const user = await findUser(identifier);

  if (!user) throw new Error('Usuario no encontrado. Verifica tus credenciales');
  if (!user.verified) throw new Error('Debes verificar tu correo institucional antes de iniciar sesión');
  if (user.password !== hashPassword(password)) throw new Error('Contraseña incorrecta');

  const { password: _, verificationCode: __, ...safeUser } = user;
  return safeUser;
};

// Exportar instancia de prisma para otros servicios
export { prisma };
