// context/AuthContext.jsx - Contexto de autenticación y manejo de sesión
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Clave usada en localStorage para persistir la sesión
const SESSION_KEY = 'ulimasocial_session';

// Crear el contexto
const AuthContext = createContext(null);

/**
 * Proveedor del contexto de autenticación
 * Maneja la sesión del usuario con localStorage para persistencia
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Verificar si hay sesión guardada al iniciar

  // ============================================================
  // Al montar: verificar si hay sesión guardada en localStorage
  // Si el usuario recarga la página, seguirá autenticado
  // ============================================================
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession);
        setUser(parsedUser);
      }
    } catch (error) {
      // Si hay error al parsear, limpiar localStorage corrupto
      console.error('Error al recuperar sesión:', error);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Iniciar sesión - guarda el usuario en estado y localStorage
   * @param {object} userData - Datos del usuario autenticado
   */
  const login = useCallback((userData) => {
    setUser(userData);
    // Persistir en localStorage para que sobreviva recargas de página
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    // También guardar en sessionStorage como capa adicional
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  }, []);

  /**
   * Cerrar sesión - limpia estado y almacenamiento
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  /**
   * Actualizar datos del usuario (para futuras funcionalidades)
   */
  const updateUser = useCallback((updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUserData));
  }, [user]);

  const value = {
    user,          // Datos del usuario actual (null si no autenticado)
    loading,       // Si está verificando la sesión guardada
    isAuthenticated: !!user, // Booleano de conveniencia
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {object} Valores del contexto de auth
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
