import { prisma } from '../services/userService.js';

// Enviar solicitud de amistad
export const sendRequest = async (req, res) => {
  try {
    const { requesterId, addresseeId } = req.body;

    if (!requesterId || !addresseeId) {
      return res.status(400).json({ message: 'requesterId y addresseeId son requeridos' });
    }

    if (requesterId === addresseeId) {
      return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo' });
    }

    // Verificar si ya existe
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Ya existe una relación o solicitud entre estos usuarios' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Solicitud enviada', friendship });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar solicitud', error: error.message });
  }
};

// Responder a solicitud (aceptar/rechazar)
export const respondRequest = async (req, res) => {
  try {
    const { id } = req.params; // friendship id
    const { action } = req.body; // 'ACCEPT' o 'REJECT'

    const friendshipId = parseInt(id);

    if (action === 'ACCEPT') {
      const friendship = await prisma.friendship.update({
        where: { id: friendshipId },
        data: { status: 'ACCEPTED' }
      });
      return res.json({ message: 'Solicitud aceptada', friendship });
    } else if (action === 'REJECT') {
      await prisma.friendship.delete({
        where: { id: friendshipId }
      });
      return res.json({ message: 'Solicitud rechazada' });
    } else {
      return res.status(400).json({ message: 'Acción inválida. Usa ACCEPT o REJECT.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al responder solicitud', error: error.message });
  }
};

// Obtener amigos y solicitudes de un usuario
export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const relations = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId }
        ]
      },
      include: {
        requester: {
          select: { id: true, name: true, lastName: true, career: true, cycle: true, profilePicture: true }
        },
        addressee: {
          select: { id: true, name: true, lastName: true, career: true, cycle: true, profilePicture: true }
        }
      }
    });

    const friends = [];
    const pendingRequests = [];

    relations.forEach(rel => {
      // Identificar quién es el "otro" usuario en la relación
      const otherUser = rel.requesterId === userId ? rel.addressee : rel.requester;
      
      if (rel.status === 'ACCEPTED') {
        friends.push(otherUser);
      } else if (rel.status === 'PENDING' && rel.addresseeId === userId) {
        // Solo mostramos las solicitudes que el usuario RECIBIÓ
        pendingRequests.push({
          friendshipId: rel.id,
          ...otherUser
        });
      }
    });

    res.json({ friends, pendingRequests });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener amigos', error: error.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    
    // Buscar la amistad en cualquier direccion
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId }
        ],
        status: 'ACCEPTED'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'No se encontró la amistad' });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Amigo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar amigo', error: error.message });
  }
};
