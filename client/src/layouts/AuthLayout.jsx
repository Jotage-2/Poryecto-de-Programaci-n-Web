// layouts/AuthLayout.jsx - Layout base para páginas de autenticación
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/UIComponents';
import { useTheme } from '../context/ThemeContext';

/**
 * Layout compartido para todas las páginas de autenticación
 * Incluye fondo decorativo, logo y panel de formulario
 */
const AuthLayout = ({ children, title, subtitle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-dark-100 dark:to-dark-200 flex items-center justify-center p-4 transition-colors duration-300">
      
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 dark:bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-orange-300/10 dark:bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      {/* Botón de modo oscuro (esquina superior derecha) */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-dark-200 shadow-md border border-gray-100 dark:border-dark-400 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all duration-200 z-10"
        title={isDark ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Contenedor principal del formulario */}
      <div className="relative w-full max-w-md page-enter">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center">
            <Logo size="lg" />
          </Link>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">
            Red social · Universidad de Lima
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="card p-6 sm:p-8 shadow-xl">
          {/* Título y subtítulo de la página */}
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Contenido de la página (formulario) */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500">
          © 2026 ULimaSocial · Solo para estudiantes de la Universidad de Lima
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
