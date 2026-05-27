// controllers/authController.js - Controladores de autenticación
import {
  createUser,
  verifyUserAccount,
  regenerateVerificationCode,
  authenticateUser,
  setPasswordResetCode,
  resetPassword,
  findUserByEmail,
} from '../services/userService.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js';

// ============================================================
// REGISTRO
// ============================================================

/**
 * POST /api/auth/register
 * Registra un nuevo usuario y envía correo de verificación
 */
export const register = async (req, res) => {
  try {
    const { name, lastName, studentCode, email, password, career, cycle, profilePicture } = req.body;

    // Validaciones del servidor
    if (!name || !lastName || !studentCode || !email || !password || !career || !cycle) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar dominio del correo institucional
    if (!email.endsWith('@aloe.ulima.edu.pe')) {
      return res.status(400).json({ message: 'El correo debe ser institucional (@aloe.ulima.edu.pe)' });
    }

    // Validar formato del código universitario (8 dígitos numéricos)
    if (!/^\d{8}$/.test(studentCode)) {
      return res.status(400).json({ message: 'El código universitario debe tener 8 dígitos numéricos' });
    }

    // Validar contraseña mínima
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Crear usuario y obtener código
    const { user, verificationCode } = createUser({
      name, lastName, studentCode, email, password, career, cycle, profilePicture
    });

    // Enviar correo de verificación
    await sendVerificationEmail(email, name, verificationCode);

    res.status(201).json({
      message: 'Cuenta creada exitosamente. Revisa tu correo para verificar tu cuenta.',
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// VERIFICACIÓN DE CORREO
// ============================================================

/**
 * POST /api/auth/verify
 * Verifica la cuenta con el código enviado al correo
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Correo y código son requeridos' });
    }

    const user = verifyUserAccount(email, code);

    res.json({
      message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/auth/resend-code
 * Reenvía el código de verificación
 */
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const { code, user } = regenerateVerificationCode(email);
    await sendVerificationEmail(email, user.name, code);

    res.json({ message: 'Código reenviado exitosamente. Revisa tu correo.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// LOGIN
// ============================================================

/**
 * POST /api/auth/login
 * Inicia sesión con correo institucional o código universitario
 */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Credenciales incompletas' });
    }

    const user = authenticateUser(identifier, password);

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// ============================================================
// RECUPERAR CONTRASEÑA
// ============================================================

/**
 * POST /api/auth/forgot-password
 * Solicita recuperación de contraseña
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!email.endsWith('@aloe.ulima.edu.pe')) {
      return res.status(400).json({ message: 'El correo debe ser institucional (@aloe.ulima.edu.pe)' });
    }

    const { code, user } = setPasswordResetCode(email);
    await sendPasswordResetEmail(email, user.name, code);

    res.json({ message: 'Se envió un código de recuperación a tu correo institucional.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/auth/reset-password
 * Restablece la contraseña con el código de verificación
 */
export const resetPasswordHandler = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    resetPassword(email, code, newPassword);

    res.json({ message: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
