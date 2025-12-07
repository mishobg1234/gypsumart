"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";

export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export async function getActiveBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return banners;
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return [];
  }
}

export async function getBannerById(id: string) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });
    return banner;
  } catch (error) {
    console.error("Error fetching banner:", error);
    return null;
  }
}

export async function createBanner(data: {
  title?: string;
  description?: string;
  images: string; // JSON string
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  active?: boolean;
}) {
  try {
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, banner };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

export async function updateBanner(
  id: string,
  data: {
    title?: string;
    description?: string;
    images?: string; // JSON string
    buttonText?: string;
    buttonLink?: string;
    order?: number;
    active?: boolean;
  }
) {
  try {
    const banner = await prisma.banner.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, banner };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: "Банерът беше изтрит успешно" };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { error: "Грешка при изтриване на банер" };
  }
}

export async function reorderBanners(bannerIds: string[]) {
  try {
    await prisma.$transaction(
      bannerIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true };
  } catch (error) {
    console.error("Error reordering banners:", error);
    return { success: false, error: "Failed to reorder banners" };
  }
}
