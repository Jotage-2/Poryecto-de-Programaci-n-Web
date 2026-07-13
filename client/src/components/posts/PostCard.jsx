import Avatar from '../user/Avatar';

const PostCard = ({ post, user, onDelete, onLike }) => (
  <article className="card p-5 hover:shadow-md transition-shadow">
    <header className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <Avatar person={user} size="sm" />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.name} {user?.lastName}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{post.fecha}</p>
        </div>
      </div>
      <button onClick={() => onDelete(post.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400" title="Eliminar publicación">🗑️</button>
    </header>
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.contenido}</p>
    <footer className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-dark-400">
      <button onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 text-xs font-semibold ${post.likedByMe ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}><span>{post.likedByMe ? '❤️' : '🤍'}</span><span>{post.likes}</span></button>
      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600"><span>💬</span><span>{post.comentarios}</span></button>
      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 ml-auto"><span>↗️</span><span>Compartir</span></button>
    </footer>
  </article>
);
export default PostCard;
