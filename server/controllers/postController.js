import { prisma } from '../services/userService.js';

// Crear una publicación
export const createPost = async (req, res) => {
  try {
    const { content, authorId } = req.body;
    
    if (!content || !authorId) {
      return res.status(400).json({ message: 'El contenido y el autor son requeridos' });
    }

    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
      include: {
        author: {
          select: { name: true, lastName: true, career: true, profilePicture: true }
        },
        likes: true
      }
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la publicación', error: error.message });
  }
};

// Obtener todas las publicaciones (Feed)
export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, lastName: true, career: true, profilePicture: true }
        },
        likes: true
      }
    });

    // Mapear para devolver cantidad de likes
    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post.likes.length
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener publicaciones', error: error.message });
  }
};

// Dar o quitar like a una publicación
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // postId
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'El userId es requerido' });
    }

    const postId = parseInt(id);

    // Verificar si ya existe el like
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });

    if (existingLike) {
      // Si existe, lo quitamos
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return res.json({ message: 'Like removido', likedByMe: false });
    } else {
      // Si no existe, lo creamos
      await prisma.like.create({
        data: {
          postId,
          userId
        }
      });
      return res.json({ message: 'Like agregado', likedByMe: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el like', error: error.message });
  }
};

// Eliminar una publicación
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    // Borrar likes asociados primero (para mantener la integridad referencial)
    await prisma.like.deleteMany({
      where: { postId }
    });

    // Borrar post
    await prisma.post.delete({
      where: { id: postId }
    });

    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar publicación', error: error.message });
  }
};
