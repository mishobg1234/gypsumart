"use server";

import { prisma } from "@/db/prisma";
import { BlogPostSchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createBlogPost(values: z.infer<typeof BlogPostSchema>) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = BlogPostSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const post = await prisma.blogPost.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: "Публикацията е създадена!", post };
  } catch (error) {
    return { error: "Грешка при създаване на публикация!" };
  }
}

export async function updateBlogPost(
  id: string,
  values: z.infer<typeof BlogPostSchema>
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = BlogPostSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: "Публикацията е обновена!", post };
  } catch (error) {
    return { error: "Грешка при обновяване на публикация!" };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: "Публикацията е изтрита!" };
  } catch (error) {
    return { error: "Грешка при изтриване на публикация!" };
  }
}

export async function getBlogPosts(published?: boolean) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: published !== undefined ? { published } : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    return post;
  } catch (error) {
    return null;
  }
}
