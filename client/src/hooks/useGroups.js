import { useState, useEffect, useCallback } from 'react';
import { getGroups, createGroup, toggleGroupMembership } from '../services/api';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const addGroup = async (groupData) => {
    try {
      await createGroup(groupData);
      await fetchGroups(); // Recargar grupos después de crear uno
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const toggleMembership = async (groupId, userId) => {
    try {
      const response = await toggleGroupMembership(groupId, userId);
      // Actualización optimista
      setGroups(currentGroups => currentGroups.map(g => {
        if (g.id === groupId) {
          const isMember = response.isMember;
          return {
            ...g,
            membersCount: isMember ? g.membersCount + 1 : g.membersCount - 1,
            members: isMember 
              ? [...g.members, { id: userId }] 
              : g.members.filter(m => m.id !== userId)
          };
        }
        return g;
      }));
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return { groups, loading, error, addGroup, toggleMembership, refreshGroups: fetchGroups };
};
