// context/FriendsContext.jsx - Estado global del sistema de amigos
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const { user } = useAuth();

  // Estructura en localStorage: { [userId]: { friends: [], sent: [], received: [] } }
  const getStorageKey = (uid) => `ulimasocial_friends_${uid}`;

  /*const loadData = useCallback(() => {
    if (!user?.id) return { friends: [], sent: [], received: [] };
    try {
      const raw = localStorage.getItem(getStorageKey(user.id));
      return raw ? JSON.parse(raw) : { friends: [], sent: [], received: [] };
    } catch {
      return { friends: [], sent: [], received: [] };
    }
  }, [user?.id]);*/

  // Usuarios de prueba para el primer avance
const DEMO_FRIENDS = [
  {
    id: 'demo-002',
    name: 'María',
    lastName: 'García',
    career: 'Psicología',
    cycle: '4',
    profilePicture: '',
  },
  {
    id: 'demo-003',
    name: 'Carlos',
    lastName: 'López',
    career: 'Ingeniería Industrial',
    cycle: '6',
    profilePicture: '',
  },
];

const DEMO_RECEIVED = [
  {
    id: 'demo-004',
    name: 'Ana',
    lastName: 'Torres',
    career: 'Derecho',
    cycle: '3',
    profilePicture: '',
    receivedAt: new Date().toISOString(),
  },
];

const loadData = useCallback(() => {
  if (!user?.id) return { friends: DEMO_FRIENDS, sent: [], received: DEMO_RECEIVED };
  try {
    const raw = localStorage.getItem(getStorageKey(user.id));
    if (raw) return JSON.parse(raw);
    // Primera vez: inicializar con datos demo
    const initial = { friends: DEMO_FRIENDS, sent: [], received: DEMO_RECEIVED };
    localStorage.setItem(getStorageKey(user.id), JSON.stringify(initial));
    return initial;
  } catch {
    return { friends: DEMO_FRIENDS, sent: [], received: DEMO_RECEIVED };
  }
}, [user?.id]);

  const [data, setData] = useState(loadData);

  // Recargar cuando cambia el usuario logueado
  useEffect(() => {
    setData(loadData());
  }, [loadData]);

  const save = (newData) => {
    if (!user?.id) return;
    localStorage.setItem(getStorageKey(user.id), JSON.stringify(newData));
    setData(newData);
  };

  // ── Acciones ──────────────────────────────────────────────

  // Enviar solicitud de amistad
  const sendRequest = useCallback((targetUser) => {
    // Guardar en "sent" del usuario actual
    const current = loadData();
    if (
      current.friends.find(f => f.id === targetUser.id) ||
      current.sent.find(f => f.id === targetUser.id)
    ) return;

    const updated = {
      ...current,
      sent: [...current.sent, { ...targetUser, sentAt: new Date().toISOString() }],
    };
    save(updated);

    // Simular que el otro usuario recibe la solicitud
    const otherKey = getStorageKey(targetUser.id);
    try {
      const otherRaw = localStorage.getItem(otherKey);
      const otherData = otherRaw ? JSON.parse(otherRaw) : { friends: [], sent: [], received: [] };
      if (!otherData.received.find(r => r.id === user.id)) {
        otherData.received.push({
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          career: user.career,
          cycle: user.cycle,
          profilePicture: user.profilePicture || '',
          receivedAt: new Date().toISOString(),
        });
        localStorage.setItem(otherKey, JSON.stringify(otherData));
      }
    } catch { /* si el otro usuario no tiene datos aún, no importa */ }
  }, [user, loadData]);

  // Aceptar solicitud recibida
  const acceptRequest = useCallback((fromUser) => {
    const current = loadData();
    const newFriend = { ...fromUser, friendSince: new Date().toISOString() };
    const updated = {
      friends: [...current.friends, newFriend],
      sent: current.sent,
      received: current.received.filter(r => r.id !== fromUser.id),
    };
    save(updated);

    // Marcar como amigos también en el lado del otro usuario
    const otherKey = getStorageKey(fromUser.id);
    try {
      const otherRaw = localStorage.getItem(otherKey);
      const otherData = otherRaw ? JSON.parse(otherRaw) : { friends: [], sent: [], received: [] };
      if (!otherData.friends.find(f => f.id === user.id)) {
        otherData.friends.push({
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          career: user.career,
          cycle: user.cycle,
          profilePicture: user.profilePicture || '',
          friendSince: new Date().toISOString(),
        });
        otherData.sent = otherData.sent.filter(s => s.id !== user.id);
      }
      localStorage.setItem(otherKey, JSON.stringify(otherData));
    } catch { /* ok */ }
  }, [user, loadData]);

  // Rechazar solicitud recibida
  const rejectRequest = useCallback((fromUserId) => {
    const current = loadData();
    save({ ...current, received: current.received.filter(r => r.id !== fromUserId) });
  }, [loadData]);

  // Cancelar solicitud enviada
  const cancelRequest = useCallback((targetUserId) => {
    const current = loadData();
    save({ ...current, sent: current.sent.filter(s => s.id !== targetUserId) });
  }, [loadData]);

  // Eliminar amigo
  const removeFriend = useCallback((friendId) => {
    const current = loadData();
    save({ ...current, friends: current.friends.filter(f => f.id !== friendId) });
  }, [loadData]);

  // ── Helpers ───────────────────────────────────────────────

  const isFriend = (userId) => data.friends.some(f => f.id === userId);
  const hasSentRequest = (userId) => data.sent.some(s => s.id === userId);
  const hasReceivedRequest = (userId) => data.received.some(r => r.id === userId);
  const pendingCount = data.received.length;

  return (
    <FriendsContext.Provider value={{
      friends: data.friends,
      sentRequests: data.sent,
      receivedRequests: data.received,
      pendingCount,
      sendRequest,
      acceptRequest,
      rejectRequest,
      cancelRequest,
      removeFriend,
      isFriend,
      hasSentRequest,
      hasReceivedRequest,
    }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error('useFriends debe usarse dentro de FriendsProvider');
  return ctx;
};