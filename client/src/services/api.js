// services/api.js - Servicio centralizado para comunicación con el backend
const BASE_URL = '/api'; // Usa el proxy de Vite configurado en vite.config.js

/**
 * Función base para peticiones HTTP
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} options - Opciones de fetch
 * @returns {Promise} Respuesta del servidor
 */
const request = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    // Re-lanzar error para que el componente lo maneje
    throw error;
  }
};

// ============================================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================================

/**
 * Registrar nuevo usuario
 */
export const registerUser = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

/**
 * Verificar cuenta con código
 */
export const verifyEmail = (email, code) =>
  request('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });

/**
 * Reenviar código de verificación
 */
export const resendVerificationCode = (email) =>
  request('/auth/resend-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

/**
 * Iniciar sesión
 */
export const loginUser = (identifier, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

/**
 * Solicitar recuperación de contraseña
 */
export const forgotPassword = (email) =>
  request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

/**
 * Restablecer contraseña
 */
export const resetPassword = (email, code, newPassword) =>
  request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  });

/**
 * Verificar salud del servidor
 */
export const checkHealth = () => request('/health');
