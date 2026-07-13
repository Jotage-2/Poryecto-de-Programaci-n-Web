import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);
const emptyState = { friends: [], sent: [], received: [] };

export const FriendsProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `ulimasocial_friends_${user?.id || 'anonymous'}`;
  const [data, setData] = useState(emptyState);

  useEffect(() => {
    try { setData(JSON.parse(localStorage.getItem(storageKey)) || emptyState); }
    catch { setData(emptyState); }
  }, [storageKey]);

  const save = useCallback((updater) => {
    setData((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const sendRequest = useCallback((targetUser) => save((current) => {
    if (current.friends.some((item) => item.id === targetUser.id) || current.sent.some((item) => item.id === targetUser.id)) return current;
    return { ...current, sent: [...current.sent, { ...targetUser, sentAt: new Date().toISOString() }] };
  }), [save]);

  const acceptRequest = useCallback((fromUser) => save((current) => ({
    friends: current.friends.some((item) => item.id === fromUser.id) ? current.friends : [...current.friends, { ...fromUser, friendSince: new Date().toISOString() }],
    sent: current.sent,
    received: current.received.filter((item) => item.id !== fromUser.id),
  })), [save]);

  const rejectRequest = useCallback((id) => save((current) => ({ ...current, received: current.received.filter((item) => item.id !== id) })), [save]);
  const cancelRequest = useCallback((id) => save((current) => ({ ...current, sent: current.sent.filter((item) => item.id !== id) })), [save]);
  const removeFriend = useCallback((id) => save((current) => ({ ...current, friends: current.friends.filter((item) => item.id !== id) })), [save]);

  const value = {
    friends: data.friends, sentRequests: data.sent, receivedRequests: data.received,
    pendingCount: data.received.length, sendRequest, acceptRequest, rejectRequest, cancelRequest, removeFriend,
    isFriend: (id) => data.friends.some((item) => item.id === id),
    hasSentRequest: (id) => data.sent.some((item) => item.id === id),
    hasReceivedRequest: (id) => data.received.some((item) => item.id === id),
  };

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) throw new Error('useFriends debe usarse dentro de FriendsProvider');
  return context;
};
