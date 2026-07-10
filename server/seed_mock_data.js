import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la carga de datos de prueba en ULimaSocialDB...');

  // Limpiar la base de datos (Opcional, pero util si se corre varias veces)
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();

  // 1. CREAR USUARIOS
  const users = [
    {
      id: "demo-user-001",
      name: "Demo",
      lastName: "Usuario",
      studentCode: "20240001",
      email: "demo@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // 123456
      career: "Ingeniería de Sistemas",
      cycle: "3",
      verified: true
    },
    {
      id: "stefano-001",
      name: "Stefano",
      lastName: "Terror de Marketing",
      studentCode: "20222331",
      email: "20222331@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // 123456
      career: "Ingeniería de Sistemas",
      cycle: "8",
      verified: true
    },
    {
      id: "maria-002",
      name: "María",
      lastName: "Gonzales",
      studentCode: "20231500",
      email: "maria@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      career: "Comunicaciones",
      cycle: "5",
      verified: true
    },
    {
      id: "carlos-003",
      name: "Carlos",
      lastName: "Mendoza",
      studentCode: "20210045",
      email: "carlos@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      career: "Administración",
      cycle: "9",
      verified: true
    },
    {
      id: "lucia-004",
      name: "Lucia",
      lastName: "Reyes",
      studentCode: "20240002",
      email: "lucia@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      career: "Ingeniería de Sistemas",
      cycle: "3",
      verified: true
    },
    {
      id: "pedro-005",
      name: "Pedro",
      lastName: "Vargas",
      studentCode: "20200033",
      email: "pedro@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      career: "Arquitectura",
      cycle: "10",
      verified: true
    },
    {
      id: "ana-006",
      name: "Ana",
      lastName: "Silva",
      studentCode: "20230005",
      email: "ana@aloe.ulima.edu.pe",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      career: "Derecho",
      cycle: "5",
      verified: true
    }
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }
  console.log('✅ Usuarios creados.');

  // 2. CREAR GRUPOS
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Programación Web",
        career: "Ingeniería de Sistemas",
        emoji: "💻",
        members: { connect: [{ id: "demo-user-001" }, { id: "stefano-001" }] }
      }
    }),
    prisma.group.create({
      data: {
        name: "Diseño UX/UI",
        career: "Comunicaciones",
        emoji: "🎨",
        members: { connect: [{ id: "maria-002" }, { id: "demo-user-001" }] }
      }
    }),
    prisma.group.create({
      data: {
        name: "Finanzas Avanzadas",
        career: "Administración",
        emoji: "📈",
        members: { connect: [{ id: "carlos-003" }] }
      }
    })
  ]);
  console.log('✅ Grupos creados.');

  // 3. CREAR PUBLICACIONES (POSTS)
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: "¡Hola a todos! Acabo de unirme a la red social de la ULima. ¿Alguien más llevando PW este ciclo?",
        authorId: "demo-user-001"
      }
    }),
    prisma.post.create({
      data: {
        content: "El proyecto final de Marketing está súper pesado. Si alguien tiene apuntes de la semana pasada, se lo agradecería un montón 🙏",
        authorId: "stefano-001"
      }
    }),
    prisma.post.create({
      data: {
        content: "Acabo de terminar mi sesión de fotos para Taller de Fotografía 📸 Quedaron geniales.",
        authorId: "maria-002"
      }
    })
  ]);
  console.log('✅ Publicaciones creadas.');

  // 4. CREAR LIKES
  await prisma.like.create({ data: { postId: posts[0].id, userId: "stefano-001" } });
  await prisma.like.create({ data: { postId: posts[0].id, userId: "maria-002" } });
  await prisma.like.create({ data: { postId: posts[1].id, userId: "demo-user-001" } });
  console.log('✅ Likes asignados.');

  // 5. CREAR AMISTADES
  await prisma.friendship.create({
    data: {
      requesterId: "demo-user-001",
      addresseeId: "stefano-001",
      status: "ACCEPTED"
    }
  });
  await prisma.friendship.create({
    data: {
      requesterId: "maria-002",
      addresseeId: "demo-user-001",
      status: "PENDING"
    }
  });
  console.log('✅ Amistades establecidas.');

  console.log('🎉 Carga de datos de prueba finalizada correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
