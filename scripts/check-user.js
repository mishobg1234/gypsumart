const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@gypsumart.bg' },
    });

    if (!user) {
      console.log('❌ Потребителят НЕ съществува!');
      return;
    }

    console.log('✅ Потребителят съществува:');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('Has password:', !!user.password);
    console.log('');

    // Test password
    const testPassword = 'admin123';
    if (user.password) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Password "admin123" is valid:', isValid);
    }
  } catch (error) {
    console.error('Грешка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
