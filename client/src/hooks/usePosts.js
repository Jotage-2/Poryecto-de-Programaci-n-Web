import { useCallback, useEffect, useMemo, useState } from 'react';

const normalizePost = (post) => ({
  ...post,
  likedBy: Array.isArray(post.likedBy)
    ? post.likedBy.map(String)
    : post.likedByMe
      ? ['legacy-viewer']
      : [],
  comments: Array.isArray(post.comments) ? post.comments : [],
});

export const usePosts = (ownerId, viewerId = ownerId) => {
  const storageKey = `ulimasocial_posts_${ownerId || 'anonymous'}`;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      const storedPosts = JSON.parse(localStorage.getItem(storageKey)) || [];
      setPosts(storedPosts.map(normalizePost));
    } catch {
      setPosts([]);
    }
  }, [storageKey]);

  const save = useCallback((next) => {
    setPosts((current) => {
      const value = typeof next === 'function' ? next(current) : next;
      localStorage.setItem(storageKey, JSON.stringify(value));
      return value;
    });
  }, [storageKey]);

  const createPost = useCallback((content) => save((current) => [{
    id: crypto.randomUUID(),
    authorId: ownerId,
    contenido: content,
    createdAt: new Date().toISOString(),
    fecha: new Date().toLocaleString('es-PE', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }),
    likedBy: [],
    comments: [],
  }, ...current]), [ownerId, save]);

  const deletePost = useCallback((id) => save((current) => current.filter((post) => post.id !== id)), [save]);

  const toggleLike = useCallback((id) => {
    if (!viewerId) return;
    const normalizedViewerId = String(viewerId);
    save((current) => current.map((post) => {
      if (post.id !== id) return post;
      const likedBy = Array.isArray(post.likedBy) ? post.likedBy.map(String) : [];
      const alreadyLiked = likedBy.includes(normalizedViewerId);
      return {
        ...post,
        likedBy: alreadyLiked
          ? likedBy.filter((item) => item !== normalizedViewerId)
          : [...likedBy, normalizedViewerId],
      };
    }));
  }, [save, viewerId]);

  const addComment = useCallback((postId, content, author) => {
    if (!content.trim() || !author?.id) return;
    const comment = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      fecha: new Date().toLocaleString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      author: {
        id: author.id,
        name: author.name,
        lastName: author.lastName,
        career: author.career,
        profilePicture: author.profilePicture || '',
      },
    };
    save((current) => current.map((post) => post.id === postId
      ? { ...post, comments: [...(post.comments || []), comment] }
      : post));
  }, [save]);

  const postsForViewer = useMemo(() => posts.map((post) => ({
    ...post,
    likes: post.likedBy?.length || 0,
    likedByMe: post.likedBy?.map(String).includes(String(viewerId)),
    comentarios: post.comments?.length || 0,
  })), [posts, viewerId]);

  return { posts: postsForViewer, createPost, deletePost, toggleLike, addComment };
};
