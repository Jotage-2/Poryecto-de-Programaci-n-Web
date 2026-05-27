// context/ThemeContext.jsx - Contexto para modo claro/oscuro
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Proveedor de tema (claro/oscuro)
 * Persiste la preferencia del usuario en localStorage
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Verificar preferencia guardada o preferencia del sistema
    const saved = localStorage.getItem('ulimasocial_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Aplicar clase 'dark' al elemento raíz cuando cambia el tema
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('ulimasocial_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ulimasocial_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
};
