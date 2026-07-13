import { useCallback, useEffect, useState } from 'react';

export const usePosts = (userId) => {
  const storageKey = `ulimasocial_posts_${userId || 'anonymous'}`;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try { setPosts(JSON.parse(localStorage.getItem(storageKey)) || []); } catch { setPosts([]); }
  }, [storageKey]);

  const save = useCallback((next) => {
    setPosts((current) => {
      const value = typeof next === 'function' ? next(current) : next;
      localStorage.setItem(storageKey, JSON.stringify(value));
      return value;
    });
  }, [storageKey]);

  const createPost = (content) => save((current) => [{
    id: crypto.randomUUID(), contenido: content,
    fecha: new Date().toLocaleString('es-PE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    likes: 0, likedByMe: false, comentarios: 0,
  }, ...current]);
  const deletePost = (id) => save((current) => current.filter((post) => post.id !== id));
  const toggleLike = (id) => save((current) => current.map((post) => post.id === id ? {
    ...post, likes: post.likedByMe ? Math.max(0, post.likes - 1) : post.likes + 1, likedByMe: !post.likedByMe,
  } : post));

  return { posts, createPost, deletePost, toggleLike };
};
