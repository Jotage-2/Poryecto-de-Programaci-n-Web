// components/common/Navbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/validators';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
//cursor-pointer es para que el cursor cambie a la manita
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-200 border-b border-gray-100 dark:border-dark-400 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Logo */}
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black text-sm shadow">
            U
          </div>
          <span className="font-black text-lg logo-gradient tracking-tight">
            ULima<span className="text-gray-800 dark:text-gray-200">Social</span>
          </span>
        </div>

        {/* Barra de búsqueda (futura funcionalidad) */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2 w-64">
          <span className="text-gray-400 text-sm">🔍</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">Buscar estudiantes...</span>
        </div>

        {/* Acciones derechas */}
        <div className="flex items-center gap-2">
          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors text-sm"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Notificaciones (futuro) */}
          <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors relative">
            <span className="text-sm">🔔</span>
          </button>

          {/* Avatar con menú */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shadow">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name, user?.lastName)
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400">▾</span>
            </button>

            {/* Menú desplegable */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 card shadow-xl py-1 animate-slide-up z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-400">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user?.name} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                  onClick={() => { setMenuOpen(false); }}
                >
                  👤 Mi perfil
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                  onClick={() => { setMenuOpen(false); navitage('/profile'); }}
                >
                  ⚙️ Configuración
                </button>
                <div className="border-t border-gray-100 dark:border-dark-400 mt-1 pt-1">
                  <button
                    onClick={() => { setMenuOpen(false); onLogout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;