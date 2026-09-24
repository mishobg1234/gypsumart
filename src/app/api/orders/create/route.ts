import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { createNotification } from "@/actions/notifications";
import { sendOrderConfirmationEmail } from "@/lib/emails";
import { z } from "zod";

const orderInput = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(6).max(30),
  deliveryMethod: z.enum(["office", "address"]),
  courier: z.enum(["speedy", "econt"]),
  office: z.string().trim().max(200).optional(),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(2000).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(100),
  total: z.number().finite().nonnegative(),
});

export async function POST(request: Request) {
  try {
    const parsed = orderInput.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Невалидни данни за поръчка" }, { status: 400 });
    }
    const { fullName, email, phone, deliveryMethod, courier, office, address, city, postalCode, notes, items } = parsed.data;
    if ((deliveryMethod === "office" && !office) || (deliveryMethod === "address" && (!address || !city))) {
      return NextResponse.json({ success: false, message: "Липсват данни за доставка" }, { status: 400 });
    }
    const productIds = items.map((item) => item.productId);
    if (new Set(productIds).size !== productIds.length) {
      return NextResponse.json({ success: false, message: "Дублирани продукти" }, { status: 400 });
    }
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, inStock: true },
      select: { id: true, name: true, price: true },
    });
    if (products.length !== items.length) {
      return NextResponse.json({ success: false, message: "Някои продукти вече не са налични" }, { status: 400 });
    }
    const productById = new Map(products.map((product) => [product.id, product]));
    const orderItems = items.map((item) => {
      const product = productById.get(item.productId)!;
      return { productId: product.id, productName: product.name, quantity: item.quantity, price: product.price };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 40 ? 0 : 3;
    const total = Math.round((subtotal + deliveryFee) * 100) / 100;
    if (Math.abs(parsed.data.total - total) > 0.011) {
      return NextResponse.json({
        success: false,
        message: "Цената на продукт е променена. Обновете кошницата и опитайте отново.",
      }, { status: 409 });
    }

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
          create: orderItems,
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
      `Получена е нова поръчка от ${fullName} на стойност ${total.toFixed(2)} €`,
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
        product: { name: item.productName || item.product?.name || "Продукт" },
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
