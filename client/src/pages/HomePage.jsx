// pages/HomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/validators';
import Navbar from '../components/common/Navbar';
import { useFriends } from '../context/FriendsContext';
import { ListaPublicaciones, ModalPublicacion } from '../components/common/Publicaciones';

// ============================================================
// SIDEBAR IZQUIERDO
// ============================================================
const LeftSidebar = ({ user, navigate, totalPosts }) => {
  const { friends, pendingCount } = useFriends();

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-3">
        <div className="card p-4">
          <div className="h-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl mb-10 relative">
            <div className="absolute bottom-0 left-4 transform translate-y-1/2">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-dark-200 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user?.name, user?.lastName)
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {user?.name} {user?.lastName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.career}</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
              {user?.cycle}° ciclo · Ingreso {user?.entryYear}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-400 grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => navigate('/amigos')}
              className="hover:bg-gray-50 dark:hover:bg-dark-300 rounded-lg p-1 transition-colors"
            >
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{friends.length}</p>
              <p className="text-xs text-gray-400">Amigos</p>
            </button>
            <div>
              {/* Contador real de posts */}
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{totalPosts}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">0</p>
              <p className="text-xs text-gray-400">Grupos</p>
            </div>
          </div>
        </div>

        <div className="card p-3">
          {[
            { icon: '🏠', label: 'Inicio', path: '/home' },
            { icon: '👤', label: 'Mi perfil', path: '/profile' },
            { icon: '👥', label: 'Amigos', path: '/amigos', badge: pendingCount > 0 ? pendingCount : null },
            { icon: '💬', label: 'Mensajes', path: '/mensajes' },
            { icon: '🏫', label: 'Grupos', path: '/grupos' },
          ].map(({ icon, label, path, badge }) => {
            const isActive = window.location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => path && navigate(path)}
                disabled={!path}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                    : path
                    ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300 cursor-pointer'
                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span>{label}</span>
                </span>
                {badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    typeof badge === 'number'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-400 text-gray-400'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR DERECHO
// ============================================================
const RightSidebar = ({ friends }) => (
  <div className="hidden xl:block w-72 shrink-0">
    <div className="sticky top-20 space-y-3">
      <div className="card p-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">
          Amigos
        </h3>
        {friends.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
            Aún no tienes amigos agregados
          </p>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                  {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(friend.name, friend.lastName)
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {friend.name} {friend.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{friend.career}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
          🔧 Información del sistema
        </h3>
        <div className="space-y-1">
          {[
            ['Versión', '1.0.0 MVP'],
            ['Estado', '🟢 Activo'],
            ['Módulo', 'Autenticación'],
          ].map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-400">{key}</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { friends } = useFriends();

  // Estado de publicaciones guardado en localStorage
  const POSTS_KEY = `ulimasocial_posts_${user?.id}`;
  const [publicaciones, setPublicaciones] = useState(() => {
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [modalAbierto, setModalAbierto] = useState(false);

  const guardarPosts = (posts) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    setPublicaciones(posts);
  };

  const handlePublicar = (texto) => {
    const nuevo = {
      id: Date.now().toString(),
      contenido: texto,
      fecha: new Date().toLocaleString('es-PE', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      likes: 0,
      likedByMe: false,
      comentarios: 0,
    };
    guardarPosts([nuevo, ...publicaciones]);
    setModalAbierto(false);
  };

  const handleEliminar = (id) => {
    guardarPosts(publicaciones.filter((p) => p.id !== id));
  };

  const handleLike = (id) => {
    guardarPosts(
      publicaciones.map((p) =>
        p.id === id
          ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />

      {/* Modal de nueva publicación */}
      {modalAbierto && (
        <ModalPublicacion
          user={user}
          onPublicar={handlePublicar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">
        <div className="flex gap-4">
          <LeftSidebar user={user} navigate={navigate} totalPosts={publicaciones.length} />

          {/* Feed central con publicaciones */}
          <div className="flex-1 min-w-0">
            <ListaPublicaciones
              publicaciones={publicaciones}
              user={user}
              onAbrirModal={() => setModalAbierto(true)}
              onEliminar={handleEliminar}
              onLike={handleLike}
            />
          </div>

          <RightSidebar friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;