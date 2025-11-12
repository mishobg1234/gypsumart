"use server";

import { prisma } from "@/db/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function getUnreadNotificationsCount() {
  try {
    const count = await prisma.notification.count({
      where: { read: false },
    });
    return count;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

export async function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function getUnreadCounts() {
  try {
    const [pendingReviews, unreadMessages, pendingOrders] = await Promise.all([
      // Непрочетени/неодобрени отзиви
      prisma.review.count({
        where: { approved: false },
      }),
      // Непрочетени съобщения
      prisma.contactMessage.count({
        where: { read: false },
      }),
      // Нови поръчки (PENDING статус)
      prisma.order.count({
        where: { status: "PENDING" },
      }),
    ]);

    return {
      reviews: pendingReviews,
      messages: unreadMessages,
      orders: pendingOrders,
    };
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return {
      reviews: 0,
      messages: 0,
      orders: 0,
    };
  }
}
