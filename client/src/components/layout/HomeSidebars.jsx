import { useAuth } from '../../context/AuthContext';
import { useFriends } from '../../context/FriendsContext';
import { getMessagesPath, getProfilePath } from '../../utils/navigation';
import Avatar from '../user/Avatar';

export const LeftSidebar = ({ user, navigate, totalPosts, pathname }) => {
  const { friends, pendingCount } = useFriends();
  const links = [
    { icon: '⌂', label: 'Inicio', path: '/home' },
    { icon: '●', label: 'Mi perfil', path: '/profile' },
    { icon: '♟', label: 'Amigos', path: '/amigos', badge: pendingCount || null },
    { icon: '✉', label: 'Mensajes', path: '/mensajes' },
    { icon: '▦', label: 'Grupos', path: '/grupos' },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-3">
        <div className="card p-4 interactive-card overflow-hidden">
          <div className="h-16 profile-cover rounded-xl mb-10 relative">
            <div className="absolute bottom-0 left-4 translate-y-1/2 rounded-full bg-white dark:bg-dark-200 p-0.5 shadow-md">
              <Avatar person={user} size="lg" onClick={() => navigate('/profile')} />
            </div>
          </div>
          <button type="button" onClick={() => navigate('/profile')} className="text-left group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">{user?.name} {user?.lastName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.career}</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{user?.cycle}° ciclo · Ingreso {user?.entryYear}</p>
          </button>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-400 grid grid-cols-3 gap-2 text-center">
            <button type="button" onClick={() => navigate('/amigos')} className="stat-button"><p className="font-bold text-sm">{friends.length}</p><p className="text-xs text-gray-400">Amigos</p></button>
            <button type="button" onClick={() => navigate('/profile?tab=posts')} className="stat-button"><p className="font-bold text-sm">{totalPosts}</p><p className="text-xs text-gray-400">Posts</p></button>
            <button type="button" onClick={() => navigate('/grupos')} className="stat-button"><p className="font-bold text-sm">0</p><p className="text-xs text-gray-400">Grupos</p></button>
          </div>
        </div>

        <nav className="card p-3">
          {links.map(({ icon, label, path, badge }) => (
            <button key={path} type="button" onClick={() => navigate(path)} className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${pathname === path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold translate-x-1' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300 hover:translate-x-1'}`}>
              <span className="flex items-center gap-2"><span>{icon}</span>{label}</span>
              {badge && <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-red-500 text-white">{badge}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export const RightSidebar = ({ friends, navigate }) => {
  const { user } = useAuth();

  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="sticky top-20 space-y-3">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Amigos</h3>
            <button type="button" onClick={() => navigate('/amigos')} className="text-[11px] text-primary-600 font-semibold hover:underline">Ver todos</button>
          </div>
          {friends.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">Aún no tienes amigos agregados</p>
          ) : (
            <div className="space-y-1">
              {friends.slice(0, 6).map((friend) => (
                <div key={friend.id} className="flex items-center gap-2 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors group">
                  <Avatar person={friend} size="sm" onClick={() => navigate(getProfilePath(friend.id, user?.id), { state: { person: friend } })} />
                  <button type="button" onClick={() => navigate(getProfilePath(friend.id, user?.id), { state: { person: friend } })} className="min-w-0 text-left flex-1">
                    <p className="text-xs font-semibold truncate group-hover:text-primary-600 transition-colors">{friend.name} {friend.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{friend.career}</p>
                  </button>
                  <button type="button" onClick={() => navigate(getMessagesPath(friend.id), { state: { person: friend } })} title={`Enviar mensaje a ${friend.name}`} className="w-8 h-8 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all">✉</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-4 border-l-4 border-l-primary-500">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Comunidad ULima</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Mantén tus publicaciones respetuosas, académicas y útiles para la comunidad universitaria.</p>
        </div>
      </div>
    </aside>
  );
};
