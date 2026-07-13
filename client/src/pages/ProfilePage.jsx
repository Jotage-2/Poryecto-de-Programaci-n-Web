import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import { usePosts } from '../hooks/usePosts';
import Navbar from '../components/common/Navbar';
import { ListaPublicaciones, ModalPublicacion } from '../components/common/Publicaciones';
import Avatar from '../components/user/Avatar';
import UserCard from '../components/user/UserCard';
import EmptyState from '../components/feedback/EmptyState';

const ProfilePage = () => {
  const { user } = useAuth();
  const { friends } = useFriends();
  const { posts, createPost, deletePost, toggleLike } = usePosts(user?.id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (content) => {
    createPost(content);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      {modalOpen && <ModalPublicacion user={user} onPublicar={handleCreate} onCerrar={() => setModalOpen(false)} />}

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-10">
        <section className="card overflow-hidden mb-4">
          <div className="h-36 bg-primary-500" />
          <div className="px-6 pb-5">
            <div className="-mt-12 w-24 h-24 rounded-full bg-white dark:bg-dark-200 p-1 shadow-lg">
              <Avatar person={user} size="xl" />
            </div>
            <h1 className="mt-3 text-xl font-black text-gray-900 dark:text-gray-100">{user?.name} {user?.lastName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.career} · {user?.cycle}° ciclo</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Ingreso {user?.entryYear} · {user?.email}</p>

            <div className="mt-4 flex gap-3">
              <div className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-dark-300"><p className="text-lg font-black">{posts.length}</p><p className="text-xs text-gray-400">📝 Publicaciones</p></div>
              <button onClick={() => setActiveTab('friends')} className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-dark-300"><p className="text-lg font-black">{friends.length}</p><p className="text-xs text-gray-400">👥 Amigos</p></button>
            </div>
          </div>
        </section>

        <div className="card p-1 flex mb-4">
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${activeTab === 'posts' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}>📝 Publicaciones ({posts.length})</button>
          <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${activeTab === 'friends' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}>👥 Amigos ({friends.length})</button>
        </div>

        {activeTab === 'posts' ? (
          <ListaPublicaciones publicaciones={posts} user={user} onAbrirModal={() => setModalOpen(true)} onEliminar={deletePost} onLike={toggleLike} />
        ) : friends.length === 0 ? (
          <EmptyState icon="👥" title="Aún no tienes amigos agregados" description="Busca estudiantes y envía solicitudes de amistad." actionLabel="Buscar amigos" onAction={() => navigate('/amigos')} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {friends.map((friend) => <div key={friend.id} className="card"><UserCard person={friend} /></div>)}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
