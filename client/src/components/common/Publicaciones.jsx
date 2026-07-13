import { useState } from 'react';
import Avatar from '../user/Avatar';
import EmptyState from '../feedback/EmptyState';
import PostCard from '../posts/PostCard';

export const ModalPublicacion = ({ user, onPublicar, onCerrar }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = () => {
    if (!texto.trim()) return;
    onPublicar(texto.trim());
    setTexto('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg card p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Crear publicación</h2>
          <button onClick={onCerrar} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-400 transition-colors">✕</button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <Avatar person={user} />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.name} {user?.lastName}</p>
            <p className="text-xs text-gray-400">Visible para la comunidad universitaria</p>
          </div>
        </div>

        <textarea
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`¿Qué estás pensando, ${user?.name}?`}
          rows={5}
          maxLength={280}
          className="w-full bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none outline-none"
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-400">
          <span className="text-xs text-gray-400">{texto.length}/280</span>
          <button onClick={handleSubmit} disabled={!texto.trim()} className="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm">Publicar</button>
        </div>
      </div>
    </div>
  );
};

export const ListaPublicaciones = ({
  publicaciones,
  currentUser,
  author = currentUser,
  onAbrirModal,
  onEliminar,
  onLike,
  onComment,
  canCreate = true,
  canDelete = false,
}) => (
  <div className="space-y-3">
    {canCreate && (
      <button onClick={onAbrirModal} className="w-full card p-4 flex items-center gap-3 interactive-card group text-left">
        <Avatar person={currentUser} />
        <div className="flex-1 bg-gray-100 dark:bg-dark-300 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-dark-400 transition-colors">¿Qué estás pensando, {currentUser?.name}?</div>
        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-lg font-bold shrink-0 shadow-md shadow-primary-600/20 group-hover:-translate-y-0.5 transition-all">+</span>
      </button>
    )}

    {publicaciones.length === 0 ? (
      <EmptyState
        icon="📝"
        title={canCreate ? 'Aún no hay publicaciones' : 'Este estudiante aún no ha publicado'}
        description={canCreate ? 'Comparte algo académico, profesional o de interés universitario.' : 'Cuando publique contenido, aparecerá en esta sección.'}
        actionLabel={canCreate ? '+ Crear primera publicación' : undefined}
        onAction={canCreate ? onAbrirModal : undefined}
      />
    ) : (
      publicaciones.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={author}
          currentUser={currentUser}
          onDelete={onEliminar}
          onLike={onLike}
          onComment={onComment}
          canDelete={canDelete}
        />
      ))
    )}
  </div>
);
