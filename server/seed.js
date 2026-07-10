import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(usersPath)) {
    console.log('No users.json found.');
    return;
  }

  const raw = fs.readFileSync(usersPath, 'utf-8');
  const oldUsers = JSON.parse(raw);

  for (const user of oldUsers) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          studentCode: user.studentCode,
          email: user.email,
          password: user.password,
          career: user.career,
          cycle: user.cycle,
          profilePicture: user.profilePicture || null,
          verificationCode: user.verificationCode || null,
          verified: user.verified,
          createdAt: new Date(user.createdAt)
        }
      });
      console.log(`Seeded user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
