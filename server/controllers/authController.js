// controllers/authController.js - Controladores de autenticación
import {
  createUser,
  verifyUserAccount,
  regenerateVerificationCode,
  authenticateUser,
  setPasswordResetCode,
  resetPassword,
  getAllUsers,
} from '../services/userService.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js';

// ============================================================
// REGISTRO
// ============================================================

export const register = async (req, res) => {
  try {
    const { name, lastName, studentCode, email, password, career, cycle, profilePicture } = req.body;

    // Validaciones del servidor
    if (!name || !lastName || !studentCode || !email || !password || !career || !cycle) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!email.endsWith('@aloe.ulima.edu.pe')) {
      return res.status(400).json({ message: 'El correo debe ser institucional (@aloe.ulima.edu.pe)' });
    }

    if (!/^\d{8}$/.test(studentCode)) {
      return res.status(400).json({ message: 'El código universitario debe tener 8 dígitos numéricos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Crear usuario y obtener código (Ahora es async)
    const { user, verificationCode } = await createUser({
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

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Correo y código son requeridos' });
    }

    const user = await verifyUserAccount(email, code);

    res.json({
      message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const { code, user } = await regenerateVerificationCode(email);
    await sendVerificationEmail(email, user.name, code);

    res.json({ message: 'Código reenviado exitosamente. Revisa tu correo.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// LOGIN
// ============================================================

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Credenciales incompletas' });
    }

    const user = await authenticateUser(identifier, password);

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ users: [] });
    }

    const query = q.toLowerCase().trim();
    const users = await getAllUsers();

    const results = users
      .filter((u) => u.verified) 
      .filter((u) =>
        u.name.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.studentCode.includes(query) ||
        u.career.toLowerCase().includes(query)
      )
      .map(({ password, verificationCode, ...safe }) => safe);

    res.json({ users: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// RECUPERAR CONTRASEÑA
// ============================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    if (!email.endsWith('@aloe.ulima.edu.pe')) {
      return res.status(400).json({ message: 'El correo debe ser institucional (@aloe.ulima.edu.pe)' });
    }

    const { code, user } = await setPasswordResetCode(email);
    await sendPasswordResetEmail(email, user.name, code);

    res.json({ message: 'Se envió un código de recuperación a tu correo institucional.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    await resetPassword(email, code, newPassword);

    res.json({ message: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
