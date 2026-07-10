// pages/FriendsPage.jsx - Página principal del sistema de amigos
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import { getInitials } from '../utils/validators';

// ============================================================
// COMPONENTE: TARJETA DE USUARIO
// ============================================================
const UserCard = ({ person, actions }) => (
  <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors">
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden shadow-sm">
        {person.profilePicture ? (
          <img src={person.profilePicture} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          getInitials(person.name, person.lastName)
        )}
      </div>
      {/* Info */}
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {person.name} {person.lastName}
        </p>
        <p className="text-xs text-gray-400">{person.career}</p>
      </div>
    </div>
    {/* Botones de acción */}
    <div className="flex items-center gap-2 shrink-0">
      {actions}
    </div>
  </div>
);

// ============================================================
// COMPONENTE: ESTADO VACÍO
// ============================================================
const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto">{description}</p>
  </div>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const FriendsPage = () => {
  const navigate = useNavigate();
  // Tab activo: 'friends' | 'received' | 'sent'
  const [activeTab, setActiveTab] = useState('friends');

  const { user } = useAuth();
  const {
    friends,
    pendingRequests: receivedRequests,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    removeFriend
  } = useFriends();

  // Mocks para solicitudes enviadas (opcional si la API no las retorna separadas aún)
  const sentRequests = [];
  const pendingCount = receivedRequests.length;

  const handleAcceptRequest = async (person) => {
    await acceptRequest(person.friendshipId);
  };

  const handleRejectRequest = async (person) => {
    await rejectRequest(person.friendshipId);
  };

  const cancelRequest = (id) => {
    // Opcional: implementación para cancelar enviadas
  };

  const tabs = [
    { id: 'friends',  label: 'Mis amigos',  count: friends.length },
    { id: 'received', label: 'Solicitudes', count: pendingCount },
    { id: 'sent',     label: 'Enviadas',    count: sentRequests.length },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-8">
        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Amigos</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Gestiona tus conexiones con otros estudiantes
          </p>
        </div>

        <div className="card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-dark-400">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                {/* Contador en el tab */}
                {tab.count > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    tab.id === 'received'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-dark-400 text-gray-500 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {/* Línea indicadora del tab activo */}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Contenido de cada tab */}
          <div className="p-4 space-y-1">

            {/* ── TAB: MIS AMIGOS ── */}
            {activeTab === 'friends' && (
              friends.length === 0 ? (
                <EmptyState
                  icon="👥"
                  title="Aún no tienes amigos"
                  description="Busca estudiantes desde la barra de búsqueda y envía solicitudes de amistad"
                />
              ) : (
                friends.map((friend) => (
                  <UserCard
                    key={friend.id}
                    person={friend}
                    actions={
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Eliminar
                      </button>
                    }
                  />
                ))
              )
            )}

            {/* ── TAB: SOLICITUDES RECIBIDAS ── */}
            {activeTab === 'received' && (
              receivedRequests.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="Sin solicitudes pendientes"
                  description="Cuando alguien te envíe una solicitud de amistad aparecerá aquí"
                />
              ) : (
                receivedRequests.map((person) => (
                  <UserCard
                    key={person.id}
                    person={person}
                    actions={
                      <>
                        <button
                          onClick={() => handleAcceptRequest(person)}
                          className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRejectRequest(person)}
                          className="text-xs bg-gray-100 dark:bg-dark-400 hover:bg-gray-200 dark:hover:bg-dark-300 text-gray-600 dark:text-gray-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Rechazar
                        </button>
                      </>
                    }
                  />
                ))
              )
            )}

            {/* ── TAB: SOLICITUDES ENVIADAS ── */}
            {activeTab === 'sent' && (
              sentRequests.length === 0 ? (
                <EmptyState
                  icon="📤"
                  title="Sin solicitudes enviadas"
                  description="Las solicitudes que envíes a otros estudiantes aparecerán aquí"
                />
              ) : (
                sentRequests.map((person) => (
                  <UserCard
                    key={person.id}
                    person={person}
                    actions={
                      <button
                        onClick={() => cancelRequest(person.id)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    }
                  />
                ))
              )
            )}

          </div>
        </div>

        {/* Botón para ir a buscar */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/home')}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            ← Volver al inicio para buscar estudiantes
          </button>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;