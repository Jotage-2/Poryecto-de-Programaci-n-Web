// pages/ProfilePage.jsx - Página de perfil del usuario
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { getInitials } from '../utils/validators';

// ============================================================
// DATOS ESTÁTICOS (amigos y grupos — sin estado)
// ============================================================
const amigosEjemplo = [
  { id: 1, nombre: 'María García', carrera: 'Psicología', ciclo: '4' },
  { id: 2, nombre: 'Carlos López', carrera: 'Ingeniería Industrial', ciclo: '5' },
  { id: 3, nombre: 'Ana Torres', carrera: 'Derecho', ciclo: '3' },
  { id: 4, nombre: 'Luis Mendoza', carrera: 'Administración', ciclo: '6' },
  { id: 5, nombre: 'Valeria Ramos', carrera: 'Ingeniería de Sistemas', ciclo: '4' },
  { id: 6, nombre: 'Diego Flores', carrera: 'Economía', ciclo: '7' },
];

const gruposEjemplo = [
  { id: 1, nombre: 'Programación Web', emoji: '💻', miembros: 24, carrera: 'Ingeniería de Sistemas' },
  { id: 2, nombre: 'Cálculo II', emoji: '📐', miembros: 18, carrera: 'Ingeniería Industrial' },
  { id: 3, nombre: 'Base de Datos', emoji: '🗄️', miembros: 30, carrera: 'Ingeniería de Sistemas' },
];

// ============================================================
// MODAL: CREAR PUBLICACIÓN
// ============================================================
const ModalPublicacion = ({ user, onPublicar, onCerrar }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = texto.trim();
    if (!trimmed) return;
    onPublicar(trimmed);
    setTexto('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className="card w-full max-w-lg p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Nueva publicación</h2>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-400 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Autor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name, user?.lastName)
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {user?.name} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user?.career}</p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full min-h-[120px] bg-gray-50 dark:bg-dark-300 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
          placeholder={`¿Qué estás pensando, ${user?.name}?`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={500}
          autoFocus
        />
        <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-1">{texto.length}/500</p>

        {/* Acciones */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-dark-400 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!texto.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE: TARJETA DE INFORMACIÓN ACADÉMICA
// ============================================================
const InfoAcademica = ({ user }) => (
  <div className="card p-5">
    <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
      <span>🎓</span> Información académica
    </h2>
    <div className="space-y-3">
      {[
        { icon: '🏫', label: 'Carrera', value: user?.career },
        { icon: '📅', label: 'Ciclo actual', value: `${user?.cycle}° ciclo` },
        { icon: '🪪', label: 'Código universitario', value: user?.studentCode },
        { icon: '📆', label: 'Año de ingreso', value: user?.entryYear },
        { icon: '📧', label: 'Correo institucional', value: user?.email },
      ].map(({ icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <span className="text-lg w-7 shrink-0">{icon}</span>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold truncate">{value || '—'}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// COMPONENTE: GRUPOS
// ============================================================
const MisGrupos = ({ grupos, navigate }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span>🏫</span> Mis grupos
        <span className="ml-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold px-2 py-0.5 rounded-full">
          {grupos.length}
        </span>
      </h2>
      <button
        onClick={() => navigate('/grupos')}
        className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
      >
        Ver todos →
      </button>
    </div>
    <div className="space-y-2">
      {grupos.map((grupo) => (
        <div
          key={grupo.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-300 hover:bg-gray-100 dark:hover:bg-dark-400 transition-colors cursor-pointer"
        >
          <span className="text-xl w-9 h-9 flex items-center justify-center bg-white dark:bg-dark-200 rounded-lg shadow-sm">
            {grupo.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{grupo.nombre}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{grupo.miembros} miembros · {grupo.carrera}</p>
          </div>
        </div>
      ))}
    </div>
    {grupos.length === 0 && (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        Aún no perteneces a ningún grupo
      </p>
    )}
  </div>
);

// ============================================================
// COMPONENTE: PUBLICACIONES
// ============================================================
const MisPublicaciones = ({ publicaciones, user, onAbrirModal, onEliminar, onLike }) => (
  <div className="space-y-3">
    {/* Botón crear publicación */}
    <button
      onClick={onAbrirModal}
      className="w-full card p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200 group text-left"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
        ) : (
          getInitials(user?.name, user?.lastName)
        )}
      </div>
      <div className="flex-1 bg-gray-100 dark:bg-dark-300 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-dark-400 transition-colors">
        ¿Qué estás pensando, {user?.name}?
      </div>
      <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-600 text-white text-lg font-bold shrink-0 shadow-sm group-hover:bg-primary-700 transition-colors">
        +
      </span>
    </button>

    {/* Lista de publicaciones o estado vacío */}
    {publicaciones.length === 0 ? (
      <div className="card p-10 text-center">
        <p className="text-5xl mb-3">📝</p>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Aún no tienes publicaciones
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Comparte algo con tus compañeros de la Universidad de Lima
        </p>
        <button
          onClick={onAbrirModal}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span>+</span> Crear primera publicación
        </button>
      </div>
    ) : (
      publicaciones.map((post) => (
        <div key={post.id} className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name, user?.lastName)
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {user?.name} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{post.fecha}</p>
              </div>
            </div>
            {/* Botón eliminar */}
            <button
              onClick={() => onEliminar(post.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-400 transition-colors text-sm"
              title="Eliminar publicación"
            >
              🗑️
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
            {post.contenido}
          </p>
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-dark-400">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-150 active:scale-110 ${
                post.likedByMe
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-400 hover:text-red-400 dark:hover:text-red-400'
              }`}
            >
              <span className={`transition-transform duration-150 ${post.likedByMe ? 'scale-125' : ''}`}>
                {post.likedByMe ? '❤️' : '🤍'}
              </span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <span>💬</span>
              <span>{post.comentarios}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-auto">
              <span>↗️</span>
              <span>Compartir</span>
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

// ============================================================
// COMPONENTE: AMIGOS
// ============================================================
const MisAmigos = ({ amigos }) => (
  <div className="space-y-2">
    {amigos.length === 0 ? (
      <div className="card p-10 text-center">
        <p className="text-4xl mb-3">👥</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Aún no tienes amigos agregados</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amigos.map((amigo) => (
          <div
            key={amigo.id}
            className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-dark-400 dark:to-dark-300 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {amigo.nombre.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{amigo.nombre}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{amigo.carrera}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{amigo.ciclo}° ciclo</p>
            </div>
            <button
              disabled
              className="text-xs text-gray-300 dark:text-gray-600 font-medium cursor-not-allowed"
            >
              Ver →
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ============================================================
// COMPONENTE PRINCIPAL - PROFILE PAGE
// ============================================================
const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('publicaciones');
  const [publicaciones, setPublicaciones] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handlePublicar = (contenido) => {
    const nueva = {
      id: Date.now(),
      contenido,
      fecha: 'Ahora mismo',
      likes: 0,
      comentarios: 0,
      likedByMe: false,
    };
    setPublicaciones((prev) => [nueva, ...prev]);
    setModalAbierto(false);
  };

  const handleEliminar = (id) => {
    setPublicaciones((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLike = (id) => {
    setPublicaciones((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
          : p
      )
    );
  };

  const tabs = [
    { id: 'publicaciones', label: 'Publicaciones', icon: '📝', count: publicaciones.length },
    { id: 'amigos', label: 'Amigos', icon: '👥', count: amigosEjemplo.length },
  ];

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

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-10">

        {/* ── CABECERA DEL PERFIL ── */}
        <div className="card overflow-hidden mb-4">
          {/* Banner: color sólido sin degradado hacia oscuro */}
          <div className="h-36 bg-primary-500" />

          {/* Avatar + info básica */}
          <div className="px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white dark:bg-dark-200 p-1 shadow-lg shrink-0">
                <div className="w-full h-full rounded-full bg-primary-500 flex items-center justify-center text-white font-black text-2xl overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user?.name, user?.lastName)
                  )}
                </div>
              </div>

              {/* Botón editar (futuro) */}
              <button
                disabled
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-dark-400 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
              >
                ✏️ Editar perfil
              </button>
            </div>

            {/* Nombre y carrera */}
            <div className="mt-3">
              <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">
                {user?.name} {user?.lastName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.career} · {user?.cycle}° ciclo
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                Ingreso {user?.entryYear} · {user?.email}
              </p>
            </div>

            {/* Estadísticas rápidas — el contador de publicaciones es reactivo */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { label: 'Publicaciones', value: publicaciones.length, icon: '📝' },
                { label: 'Amigos', value: amigosEjemplo.length, icon: '👥' },
                { label: 'Grupos', value: gruposEjemplo.length, icon: '🏫' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-dark-300 min-w-[72px]">
                  <p className="text-lg font-black text-gray-800 dark:text-gray-100">{value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{icon} {label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LAYOUT DE 2 COLUMNAS ── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <InfoAcademica user={user} />
            <MisGrupos grupos={gruposEjemplo} navigate={navigate} />
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="card p-1 mb-4">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      tabActiva === tab.id
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      tabActiva === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-dark-400 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido */}
            {tabActiva === 'publicaciones' && (
              <MisPublicaciones
                publicaciones={publicaciones}
                user={user}
                onAbrirModal={() => setModalAbierto(true)}
                onEliminar={handleEliminar}
                onLike={handleLike}
              />
            )}
            {tabActiva === 'amigos' && (
              <MisAmigos amigos={amigosEjemplo} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;