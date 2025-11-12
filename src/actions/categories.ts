"use server";

import { prisma } from "@/db/prisma";
import { CategorySchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createCategory(values: z.infer<typeof CategorySchema>) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const category = await prisma.category.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return { success: "Категорията е създадена!", category };
  } catch (error) {
    return { error: "Грешка при създаване на категория!" };
  }
}

export async function updateCategory(
  id: string,
  values: z.infer<typeof CategorySchema>
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return { success: "Категорията е обновена!", category };
  } catch (error) {
    return { error: "Грешка при обновяване на категория!" };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return { success: "Категорията е изтрита!" };
  } catch (error) {
    return { error: "Грешка при изтриване на категория!" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        parent: true,
        children: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  } catch (error) {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { inStock: true },
          orderBy: { createdAt: "desc" },
        },
        children: true,
      },
    });

    return category;
  } catch (error) {
    return null;
  }
}
