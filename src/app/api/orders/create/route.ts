import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { createNotification } from "@/actions/notifications";
import { sendOrderConfirmationEmail } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      fullName,
      email,
      phone,
      deliveryMethod,
      courier,
      office,
      address,
      city,
      postalCode,
      notes,
      items,
      total,
      deliveryFee,
    } = data;

    // Създаване на поръчката в базата данни
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryMethod,
        courier,
        deliveryOffice: office || null,
        deliveryAddress: address || null,
        deliveryCity: city || null,
        deliveryPostalCode: postalCode || null,
        notes: notes || null,
        totalAmount: total,
        deliveryFee: deliveryFee || 0,
        paymentMethod: "cod", // наложен платеж
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
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

    // Създаване на известие за нова поръчка
    await createNotification(
      "NEW_ORDER",
      "Нова поръчка",
      `Получена е нова поръчка от ${fullName} на стойност ${total.toFixed(2)} лв`,
      `/admin/orders/${order.id}`
    );

    // Изпращане на имейл за потвърждение на поръчката
    await sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: fullName,
      customerEmail: email,
      totalAmount: total,
      deliveryFee: deliveryFee || 0,
      items: order.items.map((item) => ({
        product: { name: item.product.name },
        quantity: item.quantity,
        price: item.price,
      })),
      courier,
      deliveryMethod,
      deliveryOffice: office,
      deliveryAddress: address,
      deliveryCity: city,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Поръчката е създадена успешно",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Грешка при създаване на поръчка" },
      { status: 500 }
    );
  }
}
