const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: 'cmhus55fb0000vqd4fqqjrhr' }
    });

    console.log('User found:', !!user);
    console.log('User email:', user?.email);
    console.log('Has password:', !!user?.password);
    console.log('Password length:', user?.password?.length || 0);
    
    if (user?.password) {
      console.log('Password starts with $2:', user.password.startsWith('$2'));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
