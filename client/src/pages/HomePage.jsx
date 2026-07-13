import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import Navbar from '../components/common/Navbar';
import { ListaPublicaciones, ModalPublicacion } from '../components/common/Publicaciones';
import { LeftSidebar, RightSidebar } from '../components/layout/HomeSidebars';
import { usePosts } from '../hooks/usePosts';

const HomePage = () => {
  const { user } = useAuth();
  const { friends } = useFriends();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, createPost, deletePost, toggleLike, addComment } = usePosts(user?.id, user?.id);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('compose') === '1') {
      setIsPostModalOpen(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('compose');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCreatePost = (content) => {
    createPost(content);
    setIsPostModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      {isPostModalOpen && <ModalPublicacion user={user} onPublicar={handleCreatePost} onCerrar={() => setIsPostModalOpen(false)} />}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-24 md:pb-8 page-enter">
        <div className="flex gap-4">
          <LeftSidebar user={user} navigate={navigate} totalPosts={posts.length} pathname={pathname} />
          <div className="flex-1 min-w-0">
            <ListaPublicaciones
              publicaciones={posts}
              currentUser={user}
              author={user}
              onAbrirModal={() => setIsPostModalOpen(true)}
              onEliminar={deletePost}
              onLike={toggleLike}
              onComment={addComment}
              canCreate
              canDelete
            />
          </div>
          <RightSidebar friends={friends} navigate={navigate} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
