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

// ============================================================
// ENDPOINTS DE PUBLICACIONES (POSTS)
// ============================================================

export const getPosts = () => request('/posts');

export const createPost = (content, authorId) =>
  request('/posts', {
    method: 'POST',
    body: JSON.stringify({ content, authorId }),
  });

export const toggleLike = (postId, userId) =>
  request(`/posts/${postId}/like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

export const deletePost = (postId) =>
  request(`/posts/${postId}`, {
    method: 'DELETE',
  });

// ============================================================
// ENDPOINTS DE AMIGOS
// ============================================================

export const getUserFriends = (userId) => request(`/friends/${userId}`);

export const sendFriendRequest = (requesterId, addresseeId) =>
  request('/friends/request', {
    method: 'POST',
    body: JSON.stringify({ requesterId, addresseeId }),
  });

export const respondFriendRequest = (friendshipId, action) =>
  request(`/friends/respond/${friendshipId}`, {
    method: 'POST',
    body: JSON.stringify({ action }), // 'ACCEPT' o 'REJECT'
  });

export const removeFriend = (userId, friendId) =>
  request(`/friends/remove`, {
    method: 'DELETE',
    body: JSON.stringify({ userId, friendId }),
  });

// ============================================================
// ENDPOINTS DE GRUPOS
// ============================================================

export const getGroups = () => request('/groups');

export const createGroup = (groupData) =>
  request('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData), // { name, career, emoji, creatorId }
  });

export const toggleGroupMembership = (groupId, userId) =>
  request(`/groups/${groupId}/membership`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

