import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useFriends } from '../context/FriendsContext';
import UserCard from '../components/user/UserCard';
import EmptyState from '../components/feedback/EmptyState';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import { getMessagesPath } from '../utils/navigation';

const FriendsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = ['friends', 'received', 'sent'].includes(searchParams.get('tab')) ? searchParams.get('tab') : 'friends';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const {
    friends,
    receivedRequests,
    sentRequests,
    pendingCount,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
  } = useFriends();

  const tabs = useMemo(() => [
    { id: 'friends', label: 'Mis amigos', count: friends.length },
    { id: 'received', label: 'Solicitudes', count: pendingCount },
    { id: 'sent', label: 'Enviadas', count: sentRequests.length },
  ], [friends.length, pendingCount, sentRequests.length]);

  const changeTab = (tabId) => {
    setActiveTab(tabId);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tabId);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-8 page-enter">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Amigos</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Gestiona tus conexiones con otros estudiantes.</p>
          </div>
          <button type="button" onClick={() => navigate('/home')} className="hidden sm:block px-3 py-2 rounded-xl text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">Buscar estudiantes</button>
        </div>

        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-dark-400 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => changeTab(tab.id)} className={`flex-1 min-w-28 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                {tab.label}
                {tab.count > 0 && <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab.id === 'received' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-dark-400 text-gray-500 dark:text-gray-400'}`}>{tab.count}</span>}
                {activeTab === tab.id && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            {activeTab === 'friends' && (
              friends.length === 0 ? (
                <EmptyState icon="👥" title="Aún no tienes amigos" description="Busca estudiantes desde la barra superior y envía solicitudes de amistad." actionLabel="Ir al inicio" onAction={() => navigate('/home')} />
              ) : friends.map((friend) => (
                <UserCard
                  key={friend.id}
                  person={friend}
                  actions={
                    <>
                      <button type="button" onClick={() => navigate(getMessagesPath(friend.id), { state: { person: friend } })} className="text-xs text-primary-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">Mensaje</button>
                      <button type="button" onClick={() => setFriendToRemove(friend)} className="text-xs text-red-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Eliminar</button>
                    </>
                  }
                />
              ))
            )}

            {activeTab === 'received' && (
              receivedRequests.length === 0 ? (
                <EmptyState icon="📭" title="Sin solicitudes pendientes" description="Cuando alguien te envíe una solicitud de amistad aparecerá aquí." />
              ) : receivedRequests.map((person) => (
                <UserCard
                  key={person.id}
                  person={person}
                  actions={
                    <>
                      <button type="button" onClick={() => acceptRequest(person)} className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">Aceptar</button>
                      <button type="button" onClick={() => rejectRequest(person.id)} className="text-xs bg-gray-100 dark:bg-dark-400 hover:bg-gray-200 dark:hover:bg-dark-300 text-gray-600 dark:text-gray-300 font-medium px-3 py-1.5 rounded-lg transition-colors">Rechazar</button>
                    </>
                  }
                />
              ))
            )}

            {activeTab === 'sent' && (
              sentRequests.length === 0 ? (
                <EmptyState icon="📤" title="Sin solicitudes enviadas" description="Las solicitudes que envíes a otros estudiantes aparecerán aquí." />
              ) : sentRequests.map((person) => (
                <UserCard
                  key={person.id}
                  person={person}
                  actions={<button type="button" onClick={() => cancelRequest(person.id)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-400 transition-colors">Cancelar</button>}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(friendToRemove)}
        title="Eliminar amigo"
        description={friendToRemove ? `¿Deseas eliminar a ${friendToRemove.name} ${friendToRemove.lastName} de tu lista de amigos?` : ''}
        confirmLabel="Eliminar"
        onCancel={() => setFriendToRemove(null)}
        onConfirm={() => {
          removeFriend(friendToRemove.id);
          setFriendToRemove(null);
        }}
      />
    </div>
  );
};

export default FriendsPage;
