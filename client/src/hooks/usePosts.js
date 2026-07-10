import { useState, useEffect, useCallback } from 'react';
import { getPosts, createPost, toggleLike, deletePost as apiDeletePost } from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (content, authorId) => {
    try {
      await createPost(content, authorId);
      await fetchPosts(); // Recargar los posts después de crear
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleToggleLike = async (postId, userId) => {
    try {
      const response = await toggleLike(postId, userId);
      // Actualización optimista del estado local
      setPosts(currentPosts => currentPosts.map(post => {
        if (post.id === postId) {
          const isLiked = response.likedByMe;
          return {
            ...post,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
            likes: isLiked 
              ? [...post.likes, { userId }] 
              : post.likes.filter(l => l.userId !== userId)
          };
        }
        return post;
      }));
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiDeletePost(postId);
      setPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { posts, loading, error, addPost, handleToggleLike, deletePost, refreshPosts: fetchPosts };
};
