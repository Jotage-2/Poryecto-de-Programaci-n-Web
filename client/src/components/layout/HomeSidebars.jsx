import { useFriends } from '../../context/FriendsContext';
import Avatar from '../user/Avatar';

export const LeftSidebar = ({ user, navigate, totalPosts, pathname }) => {
  const { friends, pendingCount } = useFriends();
  const links = [
    { icon: '🏠', label: 'Inicio', path: '/home' },
    { icon: '👤', label: 'Mi perfil', path: '/profile' },
    { icon: '👥', label: 'Amigos', path: '/amigos', badge: pendingCount || null },
    { icon: '💬', label: 'Mensajes', path: '/mensajes' },
    { icon: '🏫', label: 'Grupos', path: '/grupos' },
  ];

  return <aside className="hidden lg:block w-64 shrink-0"><div className="sticky top-20 space-y-3">
    <div className="card p-4">
      <div className="h-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl mb-10 relative">
        <div className="absolute bottom-0 left-4 translate-y-1/2 rounded-full bg-white dark:bg-dark-200 p-0.5 shadow-md"><Avatar person={user} size="lg" /></div>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100">{user?.name} {user?.lastName}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.career}</p>
      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">{user?.cycle}° ciclo · Ingreso {user?.entryYear}</p>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-400 grid grid-cols-3 gap-2 text-center">
        <button onClick={() => navigate('/amigos')} className="hover:bg-gray-50 dark:hover:bg-dark-300 rounded-lg p-1"><p className="font-bold text-sm">{friends.length}</p><p className="text-xs text-gray-400">Amigos</p></button>
        <div><p className="font-bold text-sm">{totalPosts}</p><p className="text-xs text-gray-400">Posts</p></div>
        <div><p className="font-bold text-sm">0</p><p className="text-xs text-gray-400">Grupos</p></div>
      </div>
    </div>
    <nav className="card p-3">{links.map(({ icon, label, path, badge }) => <button key={path} onClick={() => navigate(path)} className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${pathname === path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300'}`}><span className="flex items-center gap-2"><span>{icon}</span>{label}</span>{badge && <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-red-500 text-white">{badge}</span>}</button>)}</nav>
  </div></aside>;
};

export const RightSidebar = ({ friends }) => <aside className="hidden xl:block w-72 shrink-0"><div className="sticky top-20 space-y-3">
  <div className="card p-4"><h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">Amigos</h3>{friends.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">Aún no tienes amigos agregados</p> : <div className="space-y-3">{friends.map(friend => <div key={friend.id} className="flex items-center gap-2"><Avatar person={friend} size="sm" /><div className="min-w-0"><p className="text-xs font-semibold truncate">{friend.name} {friend.lastName}</p><p className="text-xs text-gray-400 truncate">{friend.career}</p></div></div>)}</div>}</div>
  <div className="card p-4"><h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">🔧 Información del sistema</h3>{[['Versión','1.0.0 MVP'],['Estado','🟢 Activo'],['Módulo','Frontend local']].map(([key,value]) => <div key={key} className="flex justify-between text-xs py-0.5"><span className="text-gray-400">{key}</span><span className="font-medium">{value}</span></div>)}</div>
</div></aside>;
