import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import { usePosts } from '../hooks/usePosts';
import { updateUserProfile } from '../services/api';
import { getMessagesPath } from '../utils/navigation';
import Navbar from '../components/common/Navbar';
import { ListaPublicaciones, ModalPublicacion } from '../components/common/Publicaciones';
import Avatar from '../components/user/Avatar';
import UserCard from '../components/user/UserCard';
import EmptyState from '../components/feedback/EmptyState';
import ProfileEditorModal from '../components/profile/ProfileEditorModal';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { friends } = useFriends();
  const { posts, createPost, deletePost, toggleLike, addComment } = usePosts(user?.id, user?.id);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'friends' ? 'friends' : 'posts');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setActiveTab(searchParams.get('tab') === 'friends' ? 'friends' : 'posts');
  }, [searchParams]);

  useEffect(() => {
    const postId = searchParams.get('post');
    if (!postId || activeTab !== 'posts') return;
    const timer = window.setTimeout(() => {
      document.getElementById(`post-${postId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeTab, posts.length, searchParams]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    next.delete('post');
    setSearchParams(next, { replace: true });
  };

  const handleCreate = (content) => {
    createPost(content);
    setPostModalOpen(false);
    changeTab('posts');
  };

  const handleSaveProfile = async (updates) => {
    const response = await updateUserProfile(user.id, updates);
    updateUser(response.user);
    setSavedMessage('Perfil actualizado correctamente.');
    window.setTimeout(() => setSavedMessage(''), 2200);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      {postModalOpen && <ModalPublicacion user={user} onPublicar={handleCreate} onCerrar={() => setPostModalOpen(false)} />}
      {profileModalOpen && <ProfileEditorModal user={user} onClose={() => setProfileModalOpen(false)} onSave={handleSaveProfile} />}

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-10 page-enter">
        {savedMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-gray-950 text-white text-sm font-semibold shadow-xl animate-slide-up">
            ✓ {savedMessage}
          </div>
        )}

        <section className="card overflow-hidden mb-4 interactive-card">
          <div className="h-36 sm:h-44 profile-cover relative overflow-hidden">
            <div className="absolute inset-0 profile-cover-pattern" />
            <div className="absolute top-4 right-4 text-white/70 text-xs font-bold tracking-[0.25em]">ULIMA</div>
          </div>
          <div className="px-5 sm:px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="-mt-12 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-dark-200 p-1 shadow-xl relative group">
                  <Avatar person={user} size="xl" className="w-full h-full ring-2 ring-white dark:ring-dark-200" />
                  <button type="button" onClick={() => setProfileModalOpen(true)} className="absolute inset-1 rounded-full bg-black/45 text-white text-xs font-bold opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center">Cambiar foto</button>
                </div>
                <h1 className="mt-3 text-2xl font-black text-gray-950 dark:text-gray-100">{user?.name} {user?.lastName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.career} · {user?.cycle}° ciclo</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">Ingreso {user?.entryYear} · {user?.email}</p>
                {user?.bio && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">{user.bio}</p>}
              </div>
              <button type="button" onClick={() => setProfileModalOpen(true)} className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-400 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all hover:-translate-y-0.5">✎ Editar perfil</button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => changeTab('posts')} className={`profile-stat ${activeTab === 'posts' ? 'profile-stat-active' : ''}`}>
                <span className="text-lg font-black">{posts.length}</span><span className="text-xs text-gray-400">Publicaciones</span>
              </button>
              <button type="button" onClick={() => navigate('/amigos')} className="profile-stat">
                <span className="text-lg font-black">{friends.length}</span><span className="text-xs text-gray-400">Amigos</span>
              </button>
              <button type="button" onClick={() => navigate('/grupos')} className="profile-stat">
                <span className="text-lg font-black">0</span><span className="text-xs text-gray-400">Grupos</span>
              </button>
            </div>
          </div>
        </section>

        <div className="card p-1 flex mb-4 sticky top-[4.25rem] z-20 shadow-sm">
          <button type="button" onClick={() => changeTab('posts')} className={`profile-tab ${activeTab === 'posts' ? 'profile-tab-active' : ''}`}>▤ Publicaciones ({posts.length})</button>
          <button type="button" onClick={() => changeTab('friends')} className={`profile-tab ${activeTab === 'friends' ? 'profile-tab-active' : ''}`}>♟ Amigos ({friends.length})</button>
        </div>

        {activeTab === 'posts' ? (
          <ListaPublicaciones
            publicaciones={posts}
            currentUser={user}
            author={user}
            onAbrirModal={() => setPostModalOpen(true)}
            onEliminar={deletePost}
            onLike={toggleLike}
            onComment={addComment}
            canCreate
            canDelete
          />
        ) : friends.length === 0 ? (
          <EmptyState icon="👥" title="Aún no tienes amigos agregados" description="Busca estudiantes y envía solicitudes de amistad." actionLabel="Buscar amigos" onAction={() => navigate('/amigos')} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {friends.map((friend) => (
              <div key={friend.id} className="card interactive-card">
                <UserCard
                  person={friend}
                  actions={
                    <button type="button" onClick={() => navigate(getMessagesPath(friend.id), { state: { person: friend } })} className="text-xs text-primary-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">Mensaje</button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
