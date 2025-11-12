/**
 * Script за създаване на администраторски акаунт
 * 
 * Употреба:
 * node scripts/create-admin.js
 */

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@gypsumart.bg';
  const password = 'admin123'; // ПРОМЕНЕТЕ ТОВА!
  const name = 'Administrator';

  try {
    // Проверка дали вече съществува
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('❌ Потребител с този имейл вече съществува!');
      console.log(`   Email: ${email}`);
      return;
    }

    // Хеширане на парола
    const hashedPassword = await bcrypt.hash(password, 10);

    // Създаване на админ
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Администраторски акаунт е създаден успешно!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('⚠️  ВАЖНО: Променете паролата след първия вход!');
  } catch (error) {
    console.error('❌ Грешка при създаване на администратор:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
