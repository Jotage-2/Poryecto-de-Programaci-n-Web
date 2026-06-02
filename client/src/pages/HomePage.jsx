// pages/HomePage.jsx - Pantalla principal vacía estilo red social
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/validators';
import Navbar from '../components/common/Navbar';

// ============================================================
// SIDEBAR IZQUIERDO
// ============================================================
const LeftSidebar = ({ user, navigate }) => (
  <div className="hidden lg:block w-64 shrink-0">
    <div className="sticky top-20 space-y-3">
      {/* Perfil resumido */}
      <div className="card p-4">
        {/* Banner */}
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
          {[['Amigos', '0'], ['Posts', '0'], ['Grupos', '0']].map(([label, val]) => (
            <div key={label}>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{val}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="card p-3">
        {[
          { icon: '🏠', label: 'Inicio', active: true },
          { icon: '👤', label: 'Mi perfil', active: false },
          { icon: '👥', label: 'Amigos', active: false, badge: 'Próximamente' },
          { icon: '💬', label: 'Mensajes', active: false, badge: 'Próximamente' },
          { icon: '🏫', label: 'Grupos', active: false, path:'/grupos' },
        ].map(({ icon, label, active, badge, path }) => (
          <button
            key={label}
            onClick={() => path && navigate(path)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              active
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{label}</span>
            </span>
            {badge && (
              <span className="text-xs bg-gray-100 dark:bg-dark-400 text-gray-400 px-1.5 py-0.5 rounded-md">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// FEED CENTRAL (VACÍO)
// ============================================================
const EmptyFeed = ({ user }) => (
  <div className="flex-1 min-w-0 space-y-4">
    {/* Caja de crear publicación (deshabilitada) */}
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
          ) : (
            getInitials(user?.name, user?.lastName)
          )}
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-dark-300 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed">
          ¿Qué estás pensando, {user?.name}?
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-400 flex gap-3">
        {[['📷', 'Foto/Video'], ['🎥', 'En vivo'], ['😊', 'Estado']].map(([icon, label]) => (
          <button
            key={label}
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
          >
            <span>{icon}</span>
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Estado vacío */}
    <div className="card p-12 text-center animate-fade-in">
      <div className="text-6xl mb-4 animate-bounce-soft">🎓</div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        ¡Bienvenido/a a ULimaSocial, {user?.name}!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
        Aún no hay publicaciones disponibles. Pronto podrás conectarte con otros estudiantes 
        de la Universidad de Lima, compartir momentos, unirte a grupos y mucho más.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        {[
          { icon: '👥', title: 'Conecta', desc: 'Encuentra amigos de tu carrera', soon: true },
          { icon: '📚', title: 'Comparte', desc: 'Publica fotos y actualizaciones', soon: true },
          { icon: '🏫', title: 'Únete', desc: 'Grupos de estudio y actividades', soon: true },
        ].map(({ icon, title, desc, soon }) => (
          <div
            key={title}
            className="p-4 bg-gray-50 dark:bg-dark-300 rounded-xl border border-gray-100 dark:border-dark-400"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{title}</h3>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
            {soon && (
              <span className="inline-block mt-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                Próximamente
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// SIDEBAR DERECHO
// ============================================================
const RightSidebar = () => (
  <div className="hidden xl:block w-72 shrink-0">
    <div className="sticky top-20 space-y-3">
      {/* Sugerencias de amigos */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">
          Personas que podrías conocer
        </h3>
        <div className="space-y-3">
          {[
            { name: 'María García', career: 'Psicología' },
            { name: 'Carlos López', career: 'Ingeniería Industrial' },
            { name: 'Ana Torres', career: 'Derecho' },
          ].map((person) => (
            <div key={person.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-dark-400 dark:to-dark-300 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.career}</p>
                </div>
              </div>
              <button
                disabled
                className="text-xs text-primary-600 dark:text-primary-400 font-semibold opacity-50 cursor-not-allowed whitespace-nowrap"
              >
                + Agregar
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
          Función disponible próximamente
        </p>
      </div>

      {/* Info del sistema */}
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
// COMPONENTE PRINCIPAL - HOME PAGE
// ============================================================
const HomePage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Cerrar sesión y redirigir al login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      {/* Navbar fijo */}
      <Navbar />

      {/* Layout principal */}
      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">
        <div className="flex gap-4">
          {/* Sidebar izquierdo */}
          <LeftSidebar user={user} navigate={navigate}/>

          {/* Feed central vacío */}
          <EmptyFeed user={user} />

          {/* Sidebar derecho */}
          <RightSidebar />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
