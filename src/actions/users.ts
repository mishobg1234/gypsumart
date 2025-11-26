"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });
    return users;
  } catch (_error) {
    return [];
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });
    return user;
  } catch (_error) {
    return null;
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
  }
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/users");
    return { success: "Потребителят е обновен успешно!", user };
  } catch (_error) {
    return { error: "Грешка при обновяване на потребител!" };
  }
}

export async function deleteUser(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  // Prevent admin from deleting themselves
  if (session.user.id === id) {
    return { error: "Не можете да изтриете собствения си акаунт!" };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: "Потребителят е изтрит успешно!" };
  } catch (_error) {
    return { error: "Грешка при изтриване на потребител!" };
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const session = await auth();

  if (!session || session.user.id !== userId) {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("User found:", user ? "Yes" : "No");
    console.log("User ID:", userId);
    console.log("Session User ID:", session.user.id);
    console.log("Has password:", user?.password ? "Yes" : "No");

    if (!user) {
      return { error: "Потребителят не е намерен!" };
    }

    if (!user.password) {
      return { error: "Акаунтът няма зададена парола. Моля, свържете се с администратор." };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return { error: "Текущата парола е неправилна!" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: "Паролата е променена успешно!" };
  } catch (_error) {
    return { error: "Грешка при смяна на паролата!" };
  }
}

export async function toggleUserRole(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  // Prevent admin from changing their own role
  if (session.user.id === id) {
    return { error: "Не можете да промените собствената си роля!" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: "Потребителят не е намерен!" };
    }

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");
    return {
      success: `Ролята е променена на ${newRole === "ADMIN" ? "Администратор" : "Потребител"}!`,
      user: updatedUser,
    };
  } catch (_error) {
    return { error: "Грешка при промяна на роля!" };
  }
}
