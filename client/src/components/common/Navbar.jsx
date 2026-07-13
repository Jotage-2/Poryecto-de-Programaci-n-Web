import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { searchUsers } from '../../services/api';
import { getInitials } from '../../utils/validators';
import { getProfilePath } from '../../utils/navigation';
import MobileBottomNav from '../navigation/MobileBottomNav';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { pendingCount, receivedRequests, sendRequest, isFriend, hasSentRequest, hasReceivedRequest } = useFriends();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results.filter((result) => String(result.id) !== String(user?.id)));
        setSearchOpen(true);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery, user?.id]);

  const getFriendButton = (target) => {
    if (isFriend(target.id)) return { label: 'Amigos', disabled: true, className: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
    if (hasSentRequest(target.id)) return { label: 'Enviada', disabled: true, className: 'text-gray-400 bg-gray-100 dark:bg-dark-400' };
    if (hasReceivedRequest(target.id)) return { label: 'Responder', disabled: false, className: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20', action: () => navigate('/amigos?tab=received') };
    return { label: '+ Agregar', disabled: false, className: 'text-white bg-primary-600 hover:bg-primary-700', action: () => sendRequest(target) };
  };

  const openProfile = (person) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(getProfilePath(person.id, user?.id), { state: { person } });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-200/95 border-b border-gray-100 dark:border-dark-400 shadow-sm backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <button type="button" className="flex items-center gap-2 shrink-0 group" onClick={() => navigate('/home')} aria-label="Ir al inicio">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary-600/20 group-hover:rotate-3 group-hover:scale-105 transition-transform">U</div>
            <span className="hidden md:block font-black text-lg logo-gradient tracking-tight">ULima<span className="text-gray-900 dark:text-gray-100">Social</span></span>
          </button>

          <div ref={searchRef} className="relative flex-1 max-w-md min-w-0">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2 border border-transparent focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all">
              <span className={`text-gray-400 text-sm shrink-0 ${searching ? 'animate-pulse' : ''}`}>{searching ? '◌' : '⌕'}</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
                placeholder="Buscar estudiantes..."
                className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-full min-w-0"
                aria-label="Buscar estudiantes"
              />
              {searchQuery && <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs">✕</button>}
            </div>

            {searchOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 card shadow-2xl overflow-hidden animate-slide-up z-50 min-w-[280px]">
                {searching ? (
                  <div className="px-4 py-7 text-center text-sm text-gray-400">Buscando estudiantes...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-7 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron estudiantes</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Prueba con nombre, código o carrera.</p>
                  </div>
                ) : (
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {searchResults.map((result) => {
                      const friendButton = getFriendButton(result);
                      return (
                        <div key={result.id} className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors group">
                          <button type="button" onClick={() => openProfile(result)} className="flex items-center gap-2 min-w-0 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden group-hover:ring-4 group-hover:ring-primary-100 dark:group-hover:ring-primary-900/30 transition-all">
                              {result.profilePicture ? <img src={result.profilePicture} alt={result.name} className="w-full h-full object-cover" /> : getInitials(result.name, result.lastName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-600 transition-colors">{result.name} {result.lastName}</p>
                              <p className="text-xs text-gray-400 truncate">{result.career} · {result.cycle}° ciclo</p>
                            </div>
                          </button>
                          <button
                            type="button"
                            disabled={friendButton.disabled}
                            onClick={friendButton.action}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all shrink-0 disabled:cursor-default ${friendButton.className}`}
                          >
                            {friendButton.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={toggleTheme} className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-all hover:-translate-y-0.5" title={isDark ? 'Modo claro' : 'Modo oscuro'}>{isDark ? '☀' : '◐'}</button>

            <button type="button" onClick={() => navigate('/amigos')} className="hidden sm:flex relative w-9 h-9 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-all hover:-translate-y-0.5" title="Amigos">
              <span>♟</span>
              {pendingCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{pendingCount > 9 ? '9+' : pendingCount}</span>}
            </button>

            <div ref={notificationsRef} className="relative">
              <button type="button" onClick={() => { setNotificationsOpen((open) => !open); setMenuOpen(false); }} className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-all hover:-translate-y-0.5" aria-label="Notificaciones">
                <span>♢</span>
                {pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white dark:ring-dark-200" />}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-1rem)] card shadow-2xl overflow-hidden animate-slide-up z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-400 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">Notificaciones</h3>
                    {pendingCount > 0 && <span className="text-[10px] px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-bold">{pendingCount} nueva{pendingCount === 1 ? '' : 's'}</span>}
                  </div>
                  {receivedRequests.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl mb-3">✓</div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estás al día</p>
                      <p className="text-xs text-gray-400 mt-1">Las solicitudes y novedades aparecerán aquí.</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {receivedRequests.slice(0, 4).map((person) => (
                        <button key={person.id} type="button" onClick={() => { setNotificationsOpen(false); navigate('/amigos?tab=received'); }} className="w-full px-4 py-3 flex gap-3 text-left hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors">
                          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{getInitials(person.name, person.lastName)}</div>
                          <div><p className="text-xs text-gray-700 dark:text-gray-300"><strong>{person.name} {person.lastName}</strong> te envió una solicitud de amistad.</p><p className="text-[10px] text-primary-600 mt-1 font-semibold">Revisar solicitud</p></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative flex items-center rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">
              <button type="button" onClick={() => navigate('/profile')} className="p-1 rounded-xl" title="Ir a mi perfil" aria-label="Ir a mi perfil">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-semibold text-xs shadow avatar-interactive">
                  {user?.profilePicture ? <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" /> : getInitials(user?.name, user?.lastName)}
                </div>
              </button>
              <button type="button" onClick={() => { setMenuOpen((open) => !open); setNotificationsOpen(false); }} className="flex items-center gap-1 pr-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300" aria-label="Abrir menú de usuario">
                <span className="hidden lg:block max-w-24 truncate">{user?.name}</span><span className={`text-xs text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 card shadow-2xl py-1 animate-slide-up z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-400">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.name} {user?.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button type="button" className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>● Mi perfil</button>
                  <button type="button" className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/profile?tab=posts'); }}>▤ Mis publicaciones</button>
                  <button type="button" className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/amigos'); }}>♟ Amigos {pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}</button>
                  <button type="button" className="dropdown-item sm:hidden" onClick={() => { toggleTheme(); setMenuOpen(false); }}>{isDark ? '☀ Modo claro' : '◐ Modo oscuro'}</button>
                  <div className="border-t border-gray-100 dark:border-dark-400 mt-1 pt-1">
                    <button type="button" onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">↪ Cerrar sesión</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <MobileBottomNav />
    </>
  );
};

export default Navbar;
