import { useState, useEffect, useCallback } from 'react';
import { getUserFriends, sendFriendRequest, respondFriendRequest } from '../services/api';

export const useFriends = (userId) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFriendsData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getUserFriends(userId);
      setFriends(data.friends || []);
      setPendingRequests(data.pendingRequests || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]);

  const sendRequest = async (addresseeId) => {
    try {
      await sendFriendRequest(userId, addresseeId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const respondRequest = async (friendshipId, action) => {
    try {
      await respondFriendRequest(friendshipId, action);
      await fetchFriendsData(); // Recargar después de responder
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { 
    friends, 
    pendingRequests, 
    loading, 
    error, 
    sendRequest, 
    respondRequest, 
    refreshFriends: fetchFriendsData 
  };
};
