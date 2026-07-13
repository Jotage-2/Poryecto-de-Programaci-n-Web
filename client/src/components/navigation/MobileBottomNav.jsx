import { useLocation, useNavigate } from 'react-router-dom';
import { useFriends } from '../../context/FriendsContext';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { pendingCount } = useFriends();

  const items = [
    { label: 'Inicio', icon: '⌂', path: '/home', active: pathname === '/home' },
    { label: 'Amigos', icon: '♟', path: '/amigos', active: pathname === '/amigos', badge: pendingCount },
    { label: 'Publicar', icon: '+', path: '/home?compose=1', primary: true },
    { label: 'Mensajes', icon: '✉', path: '/mensajes', active: pathname === '/mensajes' },
    { label: 'Perfil', icon: '●', path: '/profile', active: pathname === '/profile' || pathname.startsWith('/perfil/') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 dark:border-dark-400 bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-bottom">
      <div className="max-w-lg mx-auto px-2 h-16 grid grid-cols-5 items-center">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            className={`relative h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
              item.primary
                ? 'text-primary-600'
                : item.active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {item.primary ? (
              <span className="-mt-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-2xl leading-none flex items-center justify-center shadow-lg shadow-primary-600/30 border-4 border-white dark:border-dark-200 transition-transform hover:-translate-y-0.5">
                +
              </span>
            ) : (
              <span className={`relative text-lg leading-none transition-transform ${item.active ? '-translate-y-0.5' : ''}`}>
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border border-white dark:border-dark-200">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </span>
            )}
            <span className={item.primary ? '-mt-0.5' : ''}>{item.label}</span>
            {item.active && !item.primary && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-600" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
