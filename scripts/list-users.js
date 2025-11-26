const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });

    console.log('Total users:', users.length);
    console.log('');
    users.forEach((user, i) => {
      console.log(`User ${i + 1}:`);
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Has password:', !!user.password);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
