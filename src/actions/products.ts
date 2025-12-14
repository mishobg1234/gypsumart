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
      include: { category: true },
    });

    // Изчистваме кеша на всички релевантни страници
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/product/${product.slug}`);
    revalidatePath(`/products/${product.category.slug}`);

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
    // Вземаме стария slug преди да обновим продукта
    const oldProduct = await prisma.product.findUnique({
      where: { id },
      select: { slug: true, categoryId: true, category: { select: { slug: true } } },
    });

    const product = await prisma.product.update({
      where: { id },
      data: validatedFields.data,
      include: { category: true },
    });

    // Изчистваме кеша на всички релевантни страници
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/product/${product.slug}`);
    
    // Ако slug-ът е променен, изчистваме и стария
    if (oldProduct && oldProduct.slug !== product.slug) {
      revalidatePath(`/product/${oldProduct.slug}`);
    }
    
    // Изчистваме кеша на категориите
    if (oldProduct?.category.slug) {
      revalidatePath(`/products/${oldProduct.category.slug}`);
    }
    if (product.category.slug) {
      revalidatePath(`/products/${product.category.slug}`);
    }

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
    // Вземаме продукта преди да го изтрием, за да имаме slug-а и categoryId
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true, categoryId: true, category: { select: { slug: true } } },
    });

    if (!product) {
      return { error: "Продуктът не съществува!" };
    }

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

    // Изчистваме кеша на всички релевантни страници
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/product/${product.slug}`);
    revalidatePath(`/products/${product.category.slug}`);

    return { success: "Продуктът е изтрит!" };
  } catch (_error) {
    return { error: "Грешка при изтриване на продукт!" };
  }
}

export async function getProducts(categoryId?: string, searchQuery?: string) {
  try {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      where.OR = [
        {
          name: {
            contains: searchQuery.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery.trim(),
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: searchQuery.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
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
