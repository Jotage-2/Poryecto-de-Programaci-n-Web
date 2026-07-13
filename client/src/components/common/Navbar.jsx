// components/common/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { getInitials } from '../../utils/validators';

import { searchUsers } from '../../services/api';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { pendingCount, sendRequest, isFriend, hasSentRequest, hasReceivedRequest } = useFriends();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar con debounce (espera 400ms después de dejar de escribir)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchUsers(searchQuery);
      // Excluir al usuario actual de los resultados
      setSearchResults(results.filter(u => u.id !== user?.id));
      setSearchOpen(true);
      setSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, user?.id]);

  // Texto del botón según el estado de la amistad
  const getFriendButtonLabel = (targetId) => {
    if (isFriend(targetId)) return { label: '✓ Amigos', disabled: true, style: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' };
    if (hasSentRequest(targetId)) return { label: 'Enviada', disabled: true, style: 'text-gray-400 bg-gray-100 dark:bg-dark-400' };
    if (hasReceivedRequest(targetId)) return { label: 'Responder', disabled: false, style: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20', action: () => navigate('/amigos') };
    return { label: '+ Agregar', disabled: false, style: 'text-white bg-primary-600 hover:bg-primary-700' };
  };

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

        {/* Barra de búsqueda con dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-64 mx-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2">
            <span className="text-gray-400 text-sm shrink-0">
              {searching ? '⏳' : '🔍'}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              placeholder="Buscar estudiantes..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs shrink-0"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown de resultados */}
          {searchOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 card shadow-xl overflow-hidden animate-slide-up z-50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-400">No se encontraron estudiantes</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Intenta con otro nombre o código</p>
                </div>
              ) : (
                <div className="py-1 max-h-72 overflow-y-auto">
                  {searchResults.map((result) => {
                    const btn = getFriendButtonLabel(result.id);
                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                      >
                        {/* Avatar + info */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden">
                            {result.profilePicture ? (
                              <img src={result.profilePicture} alt={result.name} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(result.name, result.lastName)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {result.name} {result.lastName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{result.career} · {result.cycle}° ciclo</p>
                          </div>
                        </div>

                        {/* Botón de amistad */}
                        <button
                          disabled={btn.disabled}
                          onClick={() => {
                            if (btn.action) { btn.action(); return; }
                            if (!btn.disabled) sendRequest(result);
                          }}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 disabled:cursor-default ${btn.style}`}
                        >
                          {btn.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones derechas */}
        <div className="flex items-center gap-2">

          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors text-sm"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Botón amigos con badge */}
          <button
            onClick={() => navigate('/amigos')}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
            title="Amigos"
          >
            <span className="text-sm">👥</span>
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>

          {/* Notificaciones */}
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
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                >
                  👤 Mi perfil
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                  onClick={() => { setMenuOpen(false); navigate('/amigos'); }}
                >
                  👥 Amigos
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <div className="border-t border-gray-100 dark:border-dark-400 mt-1 pt-1">
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
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