"use server";

import { prisma } from "@/db/prisma";
import { PageSchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createPage(values: z.infer<typeof PageSchema>) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = PageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const page = await prisma.page.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);

    return { success: "Страницата е създадена!", page };
  } catch (error) {
    return { error: "Грешка при създаване на страница!" };
  }
}

export async function updatePage(
  id: string,
  values: z.infer<typeof PageSchema>
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = PageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const page = await prisma.page.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);

    return { success: "Страницата е обновена!", page };
  } catch (error) {
    return { error: "Грешка при обновяване на страница!" };
  }
}

export async function deletePage(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    const page = await prisma.page.delete({
      where: { id },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);

    return { success: "Страницата е изтрита!" };
  } catch (error) {
    return { error: "Грешка при изтриване на страница!" };
  }
}

export async function getPages(published?: boolean) {
  try {
    const pages = await prisma.page.findMany({
      where: published !== undefined ? { published } : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return pages;
  } catch (error) {
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    return page;
  } catch (error) {
    return null;
  }
}

export async function getNavbarPages() {
  try {
    const pages = await prisma.page.findMany({
      where: {
        published: true,
        showInNavbar: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        title: true,
        slug: true,
      },
    });

    return pages;
  } catch (error) {
    return [];
  }
}

export async function getFooterPages() {
  try {
    const pages = await prisma.page.findMany({
      where: {
        published: true,
        showInFooter: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        title: true,
        slug: true,
      },
    });

    return pages;
  } catch (error) {
    return [];
  }
}
