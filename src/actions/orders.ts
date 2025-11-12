"use server";

import { prisma } from "@/db/prisma";
import { OrderSchema } from "@/schemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { createNotification } from "./notifications";
import { sendOrderStatusUpdateEmail } from "@/lib/emails";

export async function createOrder(values: z.infer<typeof OrderSchema>) {
  const validatedFields = OrderSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Невалидни данни!" };
  }

  const { items, ...orderData } = validatedFields.data;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const session = await auth();
    const userId = session?.user?.id;

    const order = await prisma.order.create({
      data: {
        ...orderData,
        totalAmount,
        userId: userId || undefined,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    revalidatePath("/admin/orders");

    return { success: "Поръчката е създадена!", order };
  } catch (_error) {
    return { error: "Грешка при създаване на поръчка!" };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  // Валидация за tracking number при статус SHIPPED
  if (status === "SHIPPED" && !trackingNumber) {
    return { error: "Номер за проследяване е задължителен за изпратени поръчки!" };
  }

  try {
    // Получаване на текущата поръчка за да вземем стария статус
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return { error: "Поръчката не е намерена!" };
    }

    const oldStatus = currentOrder.status;

    // Обновяване на статуса и tracking number
    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        trackingNumber: trackingNumber || currentOrder.trackingNumber,
      },
    });

    // Създаване на известие за промяна на статус
    const statusText: Record<OrderStatus, string> = {
      PENDING: "Чакаща",
      PROCESSING: "Обработва се",
      SHIPPED: "Изпратена",
      DELIVERED: "Доставена",
      CANCELLED: "Отказана",
    };

    await createNotification(
      "ORDER_STATUS_CHANGED",
      "Промяна на статус на поръчка",
      `Поръчка #${order.id.slice(0, 8).toUpperCase()} - статус: ${statusText[status]}`,
      `/admin/orders/${order.id}`
    );

    // Изпращане на имейл за промяна на статус
    await sendOrderStatusUpdateEmail(
      order.id,
      order.customerName,
      order.customerEmail,
      oldStatus,
      status,
      trackingNumber
    );

    revalidatePath("/admin/orders");

    return { success: "Статусът на поръчката е обновен!", order };
  } catch (_error) {
    console.error("Error updating order status:", error);
    return { error: "Грешка при обновяване на поръчка!" };
  }
}

export async function deleteOrder(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Неоторизиран достъп!" };
  }

  try {
    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/admin/orders");

    return { success: "Поръчката е изтрита!" };
  } catch (_error) {
    return { error: "Грешка при изтриване на поръчка!" };
  }
}

export async function getOrders() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (_error) {
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return order;
  } catch (_error) {
    return null;
  }
}
