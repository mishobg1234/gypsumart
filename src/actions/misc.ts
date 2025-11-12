"use server";

import { prisma } from "@/db/prisma";
import { GalleryImageSchema, ReviewSchema, ContactMessageSchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createNotification } from "./notifications";

// Gallery Actions
export async function createGalleryImage(values: z.infer<typeof GalleryImageSchema>) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  const validatedFields = GalleryImageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const image = await prisma.galleryImage.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: "Изображението е добавено!", image };
  } catch (error) {
    return { error: "Грешка при добавяне на изображение!" };
  }
}

export async function deleteGalleryImage(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.galleryImage.delete({
      where: { id },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: "Изображението е изтрито!" };
  } catch (error) {
    return { error: "Грешка при изтриване на изображение!" };
  }
}

export async function getGalleryImages(category?: string) {
  try {
    const images = await prisma.galleryImage.findMany({
      where: category ? { category } : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return images;
  } catch (error) {
    return [];
  }
}

// Review Actions
export async function createReview(values: z.infer<typeof ReviewSchema>) {
  const validatedFields = ReviewSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;

    const review = await prisma.review.create({
      data: {
        ...validatedFields.data,
        userId: userId || undefined,
      },
      include: {
        product: true,
      },
    });

    // Създаване на известие за нов отзив
    await createNotification(
      "NEW_REVIEW",
      "Нов отзив",
      `${validatedFields.data.name} остави отзив за ${review.product?.name || "продукт"} (${validatedFields.data.rating}⭐)`,
      `/admin/reviews`
    );

    revalidatePath("/shop");

    return { success: "Отзивът е изпратен за одобрение!", review };
  } catch (error) {
    return { error: "Грешка при създаване на отзив!" };
  }
}

export async function approveReview(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    const review = await prisma.review.update({
      where: { id },
      data: { approved: true },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/shop");

    return { success: "Отзивът е одобрен!", review };
  } catch (error) {
    return { error: "Грешка при одобряване на отзив!" };
  }
}

export async function deleteReview(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.review.delete({
      where: { id },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/shop");

    return { success: "Отзивът е изтрит!" };
  } catch (error) {
    return { error: "Грешка при изтриване на отзив!" };
  }
}

export async function getReviews(productId?: string, approved?: boolean) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        ...(productId && { productId }),
        ...(approved !== undefined && { approved }),
      },
      include: {
        product: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    return [];
  }
}

// Contact Message Actions
export async function createContactMessage(values: z.infer<typeof ContactMessageSchema>) {
  const validatedFields = ContactMessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  try {
    const message = await prisma.contactMessage.create({
      data: validatedFields.data,
    });

    // Създаване на известие за ново съобщение
    await createNotification(
      "NEW_MESSAGE",
      "Ново съобщение",
      `Получено е ново съобщение от ${validatedFields.data.name}`,
      `/admin/messages`
    );

    return { success: "Съобщението е изпратено!", message };
  } catch (error) {
    return { error: "Грешка при изпращане на съобщение!" };
  }
}

export async function markMessageAsRead(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    revalidatePath("/admin/messages");

    return { success: "Съобщението е маркирано като прочетено!", message };
  } catch (error) {
    return { error: "Грешка!" };
  }
}

export async function deleteContactMessage(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");

    return { success: "Съобщението е изтрито!" };
  } catch (error) {
    return { error: "Грешка при изтриване на съобщение!" };
  }
}

export async function getContactMessages(read?: boolean) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return [];
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      where: read !== undefined ? { read } : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages;
  } catch (error) {
    return [];
  }
}
