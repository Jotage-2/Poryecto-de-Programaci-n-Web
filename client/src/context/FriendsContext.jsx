import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserFriends, sendFriendRequest, respondFriendRequest, removeFriend as apiRemoveFriend } from '../services/api';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const { user } = useAuth();

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsData = useCallback(async () => {
    if (!user?.id) {
      setFriends([]);
      setPendingRequests([]);
      setSentRequests([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getUserFriends(user.id);
      setFriends(data.friends || []);
      setPendingRequests(data.pendingRequests || []);
      // sentRequests are not separated in API yet, fallback to empty
      setSentRequests([]);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]);

  // ── Acciones ──────────────────────────────────────────────

  const sendRequest = async (targetUser) => {
    try {
      await sendFriendRequest(user.id, targetUser.id);
      await fetchFriendsData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const acceptRequest = async (friendshipId) => {
    try {
      await respondFriendRequest(friendshipId, 'ACCEPT');
      await fetchFriendsData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const rejectRequest = async (friendshipId) => {
    try {
      await respondFriendRequest(friendshipId, 'REJECT');
      await fetchFriendsData();
      return true;
    } catch (err) {
      return false;
    }
  };

  const cancelRequest = async (friendshipId) => {
    // Optional implementation
  };

  const removeFriend = async (friendId) => {
    try {
      await apiRemoveFriend(user.id, friendId);
      await fetchFriendsData();
      return true;
    } catch (err) {
      return false;
    }
  };

  // ── Helpers ───────────────────────────────────────────────

  const isFriend = (userId) => friends.some(f => f.id === userId);
  const hasSentRequest = (userId) => sentRequests.some(s => s.id === userId);
  const hasReceivedRequest = (userId) => pendingRequests.some(r => r.id === userId);
  const pendingCount = pendingRequests.length;

  return (
    <FriendsContext.Provider value={{
      friends,
      sentRequests,
      receivedRequests: pendingRequests,
      pendingRequests,
      pendingCount,
      loading,
      sendRequest,
      acceptRequest,
      rejectRequest,
      cancelRequest,
      removeFriend,
      isFriend,
      hasSentRequest,
      hasReceivedRequest,
      refreshFriends: fetchFriendsData
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