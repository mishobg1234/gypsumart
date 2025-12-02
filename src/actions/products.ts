"use server";

import { prisma } from "@/db/prisma";
import { ProductSchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createProduct(values: z.infer<typeof ProductSchema>) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const product = await prisma.product.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: "Продуктът е създаден!", product };
  } catch (_error) {
    return { error: "Грешка при създаване на продукт!" };
  }
}

export async function updateProduct(
  id: string,
  values: z.infer<typeof ProductSchema>
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: "Продуктът е обновен!", product };
  } catch (_error) {
    return { error: "Грешка при обновяване на продукт!" };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    // Проверка дали продуктът има поръчки
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItems) {
      return { error: "Продуктът не може да бъде изтрит, защото има свързани поръчки!" };
    }

    // Първо изтриваме рецензиите
    await prisma.review.deleteMany({
      where: { productId: id },
    });

    // След това изтриваме продукта
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: "Продуктът е изтрит!" };
  } catch (_error) {
    return { error: "Грешка при изтриване на продукт!" };
  }
}

export async function getProducts(categoryId?: string) {
  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true,
        reviews: {
          where: { approved: true },
        },
        _count: {
          select: { reviews: { where: { approved: true } } },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (_error) {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return product;
  } catch (_error) {
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, inStock: true },
      include: {
        category: true,
        reviews: {
          where: { approved: true },
        },
        _count: {
          select: { reviews: { where: { approved: true } } },
        },
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (_error) {
    return [];
  }
}
