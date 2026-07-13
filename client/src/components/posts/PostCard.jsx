import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../user/Avatar';
import ConfirmDialog from '../modals/ConfirmDialog';
import { getProfilePath } from '../../utils/navigation';

const PostCard = ({ post, author, currentUser, onDelete, onLike, onComment, canDelete = false }) => {
  const navigate = useNavigate();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const comments = useMemo(() => post.comments || [], [post.comments]);

  const openAuthorProfile = () => {
    navigate(getProfilePath(author?.id, currentUser?.id), { state: { person: author } });
  };

  const submitComment = (event) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!content) return;
    onComment?.(post.id, content, currentUser);
    setCommentText('');
    setCommentsOpen(true);
  };

  const sharePost = async () => {
    const profilePath = getProfilePath(author?.id, currentUser?.id);
    const separator = profilePath.includes('?') ? '&' : '?';
    const shareUrl = `${window.location.origin}${profilePath}${separator}tab=posts&post=${encodeURIComponent(post.id)}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Enlace copiado');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setShareStatus('Enlace copiado');
    }
    window.setTimeout(() => setShareStatus(''), 1800);
  };

  return (
    <>
      <article id={`post-${post.id}`} className="card p-5 interactive-card scroll-mt-24">
        <header className="flex items-center justify-between mb-3">
          <button type="button" onClick={openAuthorProfile} className="flex items-center gap-3 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 group">
            <Avatar person={author} size="sm" className="group-hover:ring-4 group-hover:ring-primary-100 dark:group-hover:ring-primary-900/30 transition-all" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{author?.name} {author?.lastName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{post.fecha}</p>
            </div>
          </button>
          {canDelete && (
            <button type="button" onClick={() => setConfirmOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all" title="Eliminar publicación" aria-label="Eliminar publicación">⌫</button>
          )}
        </header>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.contenido}</p>

        <footer className="flex items-center gap-2 sm:gap-4 pt-3 border-t border-gray-100 dark:border-dark-400">
          <button type="button" onClick={() => onLike?.(post.id)} className={`social-action ${post.likedByMe ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
            <span className={`transition-transform ${post.likedByMe ? 'animate-heart-pop' : ''}`}>{post.likedByMe ? '♥' : '♡'}</span>
            <span>{post.likes}</span>
          </button>
          <button type="button" onClick={() => setCommentsOpen((open) => !open)} className={`social-action ${commentsOpen ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
            <span>◌</span><span>{post.comentarios}</span><span className="hidden sm:inline">Comentarios</span>
          </button>
          <button type="button" onClick={sharePost} className="social-action text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 ml-auto">
            <span>↗</span><span className="hidden sm:inline">{shareStatus || 'Compartir'}</span>
          </button>
        </footer>

        {commentsOpen && (
          <section className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-400 animate-slide-up">
            {comments.length > 0 ? (
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar
                      person={comment.author}
                      size="sm"
                      onClick={() => navigate(getProfilePath(comment.author?.id, currentUser?.id), { state: { person: comment.author } })}
                    />
                    <div className="flex-1 min-w-0 rounded-2xl rounded-tl-md bg-gray-100 dark:bg-dark-300 px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <button type="button" onClick={() => navigate(getProfilePath(comment.author?.id, currentUser?.id), { state: { person: comment.author } })} className="text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-primary-600 truncate">
                          {comment.author?.name} {comment.author?.lastName}
                        </button>
                        <span className="text-[10px] text-gray-400 shrink-0">{comment.fecha}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2 mb-2">Sé el primero en comentar esta publicación.</p>
            )}

            <form onSubmit={submitComment} className="flex items-center gap-2">
              <Avatar person={currentUser} size="sm" />
              <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2 border border-transparent focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all">
                <input
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  maxLength={180}
                  placeholder="Escribe un comentario..."
                  className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400"
                />
                <button type="submit" disabled={!commentText.trim()} className="text-primary-600 font-black disabled:opacity-30 transition-opacity" aria-label="Publicar comentario">➤</button>
              </div>
            </form>
          </section>
        )}
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar publicación"
        description="Esta acción quitará la publicación y sus comentarios del almacenamiento local. No se puede deshacer."
        confirmLabel="Eliminar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(post.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

export default PostCard;
