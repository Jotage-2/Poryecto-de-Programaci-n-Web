import { prisma } from '../services/userService.js';

// Crear un nuevo grupo
export const createGroup = async (req, res) => {
  try {
    const { name, career, emoji, creatorId } = req.body;

    if (!name || !career || !emoji || !creatorId) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        career,
        emoji,
        members: {
          connect: { id: creatorId } // Agregamos al creador como primer miembro
        }
      },
      include: {
        members: { select: { id: true, name: true, lastName: true } }
      }
    });

    res.status(201).json({ message: 'Grupo creado exitosamente', group });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el grupo', error: error.message });
  }
};

// Obtener todos los grupos
export const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: { select: { id: true } }
      }
    });

    // Mapear para devolver conteo de miembros
    const formatted = groups.map(g => ({
      ...g,
      membersCount: g.members.length
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener grupos', error: error.message });
  }
};

// Unirse o salir de un grupo
export const toggleMembership = async (req, res) => {
  try {
    const { id } = req.params; // groupId
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId es requerido' });
    }

    const groupId = parseInt(id);

    // Buscar el grupo con sus miembros
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { select: { id: true } } }
    });

    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    const isMember = group.members.some(m => m.id === userId);

    if (isMember) {
      // Salir del grupo
      await prisma.group.update({
        where: { id: groupId },
        data: {
          members: {
            disconnect: { id: userId }
          }
        }
      });
      return res.json({ message: 'Saliste del grupo', isMember: false });
    } else {
      // Unirse al grupo
      await prisma.group.update({
        where: { id: groupId },
        data: {
          members: {
            connect: { id: userId }
          }
        }
      });
      return res.json({ message: 'Te uniste al grupo', isMember: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};
