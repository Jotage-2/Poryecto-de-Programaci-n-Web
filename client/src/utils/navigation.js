export const getProfilePath = (targetUserId, currentUserId) => {
  if (!targetUserId || String(targetUserId) === String(currentUserId)) return '/profile';
  return `/perfil/${encodeURIComponent(targetUserId)}`;
};

export const getPostsPath = (targetUserId, currentUserId) => {
  const profilePath = getProfilePath(targetUserId, currentUserId);
  return String(targetUserId) === String(currentUserId) || !targetUserId
    ? `${profilePath}?tab=posts`
    : `${profilePath}?tab=posts`;
};

export const getMessagesPath = (targetUserId) => (
  targetUserId ? `/mensajes?user=${encodeURIComponent(targetUserId)}` : '/mensajes'
);
