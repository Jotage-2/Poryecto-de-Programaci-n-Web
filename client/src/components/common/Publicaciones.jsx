// components/common/Publicaciones.jsx - Componente reutilizable de publicaciones
import { useState } from 'react';
import { getInitials } from '../../utils/validators';

// ============================================================
// MODAL PARA CREAR PUBLICACIÓN
// ============================================================
export const ModalPublicacion = ({ user, onPublicar, onCerrar }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = () => {
    if (!texto.trim()) return;
    onPublicar(texto.trim());
    setTexto('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg card p-5 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Crear publicación</h2>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-3 mb-3">
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
            <p className="text-xs text-gray-400">Publicación pública</p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`¿Qué estás pensando, ${user?.name}?`}
          rows={4}
          className="w-full bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none outline-none"
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-400">
          <span className={`text-xs ${texto.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
            {texto.length}/280
          </span>
          <button
            onClick={handleSubmit}
            disabled={!texto.trim() || texto.length > 280}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LISTA DE PUBLICACIONES
// ============================================================
export const ListaPublicaciones = ({ publicaciones, user, onAbrirModal, onEliminar, onLike }) => (
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

    {/* Lista o estado vacío */}
    {publicaciones.length === 0 ? (
      <div className="card p-10 text-center">
        <p className="text-5xl mb-3">📝</p>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Aún no hay publicaciones
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