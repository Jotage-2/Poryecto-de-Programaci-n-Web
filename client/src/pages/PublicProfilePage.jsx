import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import { usePosts } from '../hooks/usePosts';
import { getUserById } from '../services/api';
import { getMessagesPath } from '../utils/navigation';
import Navbar from '../components/common/Navbar';
import Avatar from '../components/user/Avatar';
import EmptyState from '../components/feedback/EmptyState';
import { ListaPublicaciones } from '../components/common/Publicaciones';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const {
    isFriend,
    hasSentRequest,
    hasReceivedRequest,
    sendRequest,
  } = useFriends();
  const [profileUser, setProfileUser] = useState(state?.person || null);
  const [loading, setLoading] = useState(!state?.person);
  const { posts, toggleLike, addComment } = usePosts(userId, currentUser?.id);

  useEffect(() => {
    if (String(userId) === String(currentUser?.id)) {
      navigate('/profile', { replace: true });
      return;
    }

    let active = true;
    setLoading(true);
    getUserById(userId).then((foundUser) => {
      if (!active) return;
      setProfileUser(foundUser || state?.person || null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [currentUser?.id, navigate, state?.person, userId]);

  useEffect(() => {
    const postId = searchParams.get('post');
    if (!postId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`post-${postId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [posts.length, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-100"><Navbar /><main className="max-w-4xl mx-auto px-4 pt-24"><div className="card p-12 text-center"><div className="w-10 h-10 mx-auto border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" /><p className="text-sm text-gray-400 mt-4">Cargando perfil...</p></div></main></div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-100"><Navbar /><main className="max-w-3xl mx-auto px-4 pt-24 pb-24"><EmptyState icon="🔎" title="Perfil no disponible" description="El estudiante no existe o su información ya no está disponible." actionLabel="Volver al inicio" onAction={() => navigate('/home')} /></main></div>
    );
  }

  const friend = isFriend(profileUser.id);
  const sent = hasSentRequest(profileUser.id);
  const received = hasReceivedRequest(profileUser.id);

  const primaryAction = () => {
    if (friend) {
      navigate(getMessagesPath(profileUser.id), { state: { person: profileUser } });
    } else if (received) {
      navigate('/amigos?tab=received');
    } else if (!sent) {
      sendRequest(profileUser);
    }
  };

  const primaryLabel = friend ? '✉ Enviar mensaje' : received ? 'Responder solicitud' : sent ? 'Solicitud enviada' : '+ Agregar amigo';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-24 md:pb-10 page-enter">
        <section className="card overflow-hidden mb-4 interactive-card">
          <div className="h-36 sm:h-44 profile-cover relative overflow-hidden"><div className="absolute inset-0 profile-cover-pattern" /><div className="absolute top-4 right-4 text-white/70 text-xs font-bold tracking-[0.25em]">ULIMA</div></div>
          <div className="px-5 sm:px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="-mt-12 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-dark-200 p-1 shadow-xl">
                  <Avatar person={profileUser} size="xl" className="w-full h-full ring-2 ring-white dark:ring-dark-200" />
                </div>
                <h1 className="mt-3 text-2xl font-black text-gray-950 dark:text-gray-100">{profileUser.name} {profileUser.lastName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileUser.career}{profileUser.cycle ? ` · ${profileUser.cycle}° ciclo` : ''}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-0.5">{profileUser.entryYear ? `Ingreso ${profileUser.entryYear}` : 'Estudiante de la Universidad de Lima'}</p>
                {profileUser.bio && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">{profileUser.bio}</p>}
              </div>
              <div className="flex gap-2 self-start sm:self-auto">
                <button type="button" disabled={sent} onClick={primaryAction} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${friend ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20' : sent ? 'bg-gray-100 dark:bg-dark-300 text-gray-400 cursor-default' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20'}`}>{primaryLabel}</button>
                {friend && <button type="button" onClick={() => navigate('/amigos')} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-400 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors">Amigos</button>}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <div className="profile-stat profile-stat-active"><span className="text-lg font-black">{posts.length}</span><span className="text-xs text-gray-400">Publicaciones</span></div>
              <div className="profile-stat"><span className="text-lg font-black">{friend ? '✓' : '—'}</span><span className="text-xs text-gray-400">Conexión</span></div>
            </div>
          </div>
        </section>

        <div className="card px-4 py-3 mb-4 flex items-center justify-between">
          <div><h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Publicaciones</h2><p className="text-xs text-gray-400">Actividad pública de {profileUser.name}</p></div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600">{posts.length}</span>
        </div>

        <ListaPublicaciones
          publicaciones={posts}
          currentUser={currentUser}
          author={profileUser}
          onLike={toggleLike}
          onComment={addComment}
          canCreate={false}
          canDelete={false}
        />
      </main>
    </div>
  );
};

export default PublicProfilePage;
