// routes/authRoutes.js - Definición de rutas de autenticación
import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendCode,
  login,
  forgotPassword,
  resetPasswordHandler,
} from '../controllers/authController.js';

const router = Router();

// ============================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================

// Registro de nuevo usuario
router.post('/register', register);

// Verificación de correo con código
router.post('/verify', verifyEmail);

// Reenviar código de verificación
router.post('/resend-code', resendCode);

// Inicio de sesión
router.post('/login', login);

// Solicitar recuperación de contraseña
router.post('/forgot-password', forgotPassword);

// Restablecer contraseña con código
router.post('/reset-password', resetPasswordHandler);

export default router;
