import { resend, FROM_EMAIL } from "@/lib/resend";
import { formatPriceHTML } from "@/lib/currency";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "https://artbuildshop.com").replace(/\/$/, "");
const appDescription = process.env.APP_DESCRIPTION || process.env.APP_DESCRPTION || "Гипсови изделия за дом и индустрия";

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  deliveryFee: number;
  items: OrderItem[];
  courier: string;
  deliveryMethod: string;
  deliveryOffice?: string | null;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const {
    orderId,
    customerName,
    customerEmail,
    totalAmount,
    deliveryFee,
    items,
    courier,
    deliveryMethod,
    deliveryOffice,
    deliveryAddress,
    deliveryCity,
  } = orderData;

  const itemsTotal = totalAmount - deliveryFee;
  const orderNumber = orderId.slice(-8).toUpperCase();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Потвърждение на поръчка</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 10px;
          }
          .content {
            padding: 30px 20px;
          }
          .order-number {
            background-color: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
          }
          .order-number p {
            margin: 0 0 5px 0;
            color: #92400e;
            font-size: 14px;
          }
          .order-number h2 {
            margin: 0;
            color: #f59e0b;
            font-size: 32px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h3 {
            color: #1f2937;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-name {
            font-weight: 500;
            color: #1f2937;
          }
          .item-details {
            color: #6b7280;
            font-size: 14px;
          }
          .item-price {
            font-weight: 600;
            color: #1f2937;
          }
          .total-section {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #6b7280;
          }
          .total-final {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-top: 2px solid #d1d5db;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
          }
          .total-final .amount {
            color: #f59e0b;
          }
          .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box p {
            margin: 5px 0;
            color: #1e40af;
          }
          .steps {
            background-color: #ecfdf5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .steps h4 {
            color: #065f46;
            margin-top: 0;
          }
          .steps ol {
            margin: 10px 0;
            padding-left: 20px;
          }
          .steps li {
            color: #047857;
            margin: 8px 0;
          }
          .footer {
            background-color: #1f2937;
            color: #9ca3af;
            padding: 30px 20px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: #f59e0b;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            background-color: #f59e0b;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Благодарим за поръчката!</h1>
            <p>Вашата поръчка беше приета успешно</p>
          </div>

          <div class="content">
            <p>Здравейте, <strong>${customerName}</strong>!</p>
            <p>Получихме вашата поръчка и я обработваме в момента.</p>

            <div class="order-number">
              <p>Номер на поръчка</p>
              <h2>#${orderNumber}</h2>
            </div>

            <div class="section">
              <h3>📦 Вашата поръчка</h3>
              ${items.map(item => `
                <div class="item">
                  <div>
                    <div class="item-name">${item.product.name}</div>
                    <div class="item-details">${item.quantity} x ${formatPriceHTML(item.price).full}</div>
                  </div>
                  <div class="item-price">${formatPriceHTML(item.quantity * item.price).full}</div>
                </div>
              `).join('')}

              <div class="total-section">
                <div class="total-row">
                  <span>Продукти</span>
                  <span>${formatPriceHTML(itemsTotal).full}</span>
                </div>
                <div class="total-row">
                  <span>Доставка</span>
                  <span>${deliveryFee === 0 ? 'Безплатна ✓' : formatPriceHTML(deliveryFee).full}</span>
                </div>
                <div class="total-final">
                  <span>Обща сума</span>
                  <span class="amount">${formatPriceHTML(totalAmount).full}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>🚚 Доставка</h3>
              <div class="info-box">
                <p><strong>Куриер:</strong> ${courier === 'speedy' ? 'Спиди' : 'Еконт'}</p>
                ${deliveryMethod === 'office' 
                  ? `<p><strong>До офис:</strong> ${deliveryOffice}</p>`
                  : `<p><strong>До адрес:</strong> ${deliveryCity}, ${deliveryAddress}</p>`
                }
                <p><strong>Плащане:</strong> Наложен платеж (при получаване)</p>
              </div>
            </div>

            <div class="steps">
              <h4>📋 Следващи стъпки</h4>
              <ol>
                <li>Ще ви се обадим за потвърждаване на поръчката</li>
                <li>Ще подготвим продуктите за изпращане (1-2 работни дни)</li>
                <li>Ще получите номер за проследяване от куриера</li>
                <li>Пратката ще пристигне на посочения адрес/офис</li>
              </ol>
            </div>

            <div style="text-align: center;">
              <a href="${siteUrl}/order-confirmation/${orderId}" class="button">
                Виж детайли на поръчката
              </a>
            </div>

            <p>Ако имате въпроси относно вашата поръчка, не се колебайте да се свържете с нас.</p>
          </div>

          <div class="footer">
            <p><strong>ArtBuildShop</strong></p>
            <p>Изделия от гипс за вашия дом</p>
            <p style="margin-top: 15px;">
              <a href="${siteUrl}/contact">Контакти</a> •
              <a href="${siteUrl}">Начало</a> •
              <a href="${siteUrl}/products">Продукти</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject: `Потвърждение на поръчка #${orderNumber} - ArtBuildShop`,
      html,
    });

    if (error) {
      console.error("Error sending order confirmation email:", error);
      return { success: false, error };
    }

    console.log("Order confirmation email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendOrderStatusUpdateEmail(
  orderId: string,
  customerName: string,
  customerEmail: string,
  oldStatus: string,
  newStatus: string,
  trackingNumber?: string
) {
  const orderNumber = orderId.slice(-8).toUpperCase();

  const statusTranslations: Record<string, string> = {
    PENDING: "Чакаща",
    PROCESSING: "Обработва се",
    SHIPPED: "Изпратена",
    DELIVERED: "Доставена",
    CANCELLED: "Отказана",
  };

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    PROCESSING: "#3b82f6",
    SHIPPED: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
  };

  const statusEmojis: Record<string, string> = {
    PENDING: "⏳",
    PROCESSING: "🔄",
    SHIPPED: "📦",
    DELIVERED: "✅",
    CANCELLED: "❌",
  };

  const statusMessages: Record<string, string> = {
    PENDING: "Вашата поръчка е получена и очаква обработка.",
    PROCESSING: "Подготвяме вашата поръчка за изпращане.",
    SHIPPED: "Поръчката е изпратена! Очаквайте я скоро.",
    DELIVERED: "Поръчката е доставена успешно! Благодарим ви!",
    CANCELLED: "Поръчката е отказана. Свържете се с нас за повече информация.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Актуализация на поръчка</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, ${statusColors[newStatus]} 0%, ${statusColors[newStatus]}dd 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .status-icon {
            font-size: 64px;
            margin-bottom: 10px;
          }
          .content {
            padding: 30px 20px;
          }
          .status-update {
            background-color: #f9fafb;
            border: 2px solid ${statusColors[newStatus]};
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .status-badge {
            display: inline-block;
            background-color: ${statusColors[newStatus]};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 18px;
            margin: 10px 0;
          }
          .order-number {
            background-color: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
          }
          .order-number p {
            margin: 0 0 5px 0;
            color: #92400e;
            font-size: 14px;
          }
          .order-number h3 {
            margin: 0;
            color: #f59e0b;
            font-size: 24px;
          }
          .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            background-color: ${statusColors[newStatus]};
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            background-color: #1f2937;
            color: #9ca3af;
            padding: 30px 20px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: #f59e0b;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="status-icon">${statusEmojis[newStatus]}</div>
            <h1>Актуализация на поръчка</h1>
            <p>${statusMessages[newStatus]}</p>
          </div>

          <div class="content">
            <p>Здравейте, <strong>${customerName}</strong>!</p>
            
            <div class="order-number">
              <p>Поръчка</p>
              <h3>#${orderNumber}</h3>
            </div>

            <div class="status-update">
              <p style="color: #6b7280; margin: 0 0 10px 0;">Нов статус</p>
              <div class="status-badge">${statusTranslations[newStatus]}</div>
              <p style="color: #6b7280; margin: 15px 0 0 0; font-size: 14px;">
                Предишен статус: ${statusTranslations[oldStatus]}
              </p>
            </div>

            ${newStatus === 'SHIPPED' && trackingNumber ? `
              <div class="info-box" style="background-color: #f0fdf4; border-left-color: #10b981;">
                <p style="margin: 0 0 10px 0;"><strong>📦 Номер за проследяване:</strong></p>
                <p style="font-size: 20px; font-weight: 600; color: #059669; margin: 0; font-family: monospace;">
                  ${trackingNumber}
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                  Можете да проследите вашата пратка с този номер при куриера.
                </p>
              </div>
            ` : newStatus === 'SHIPPED' ? `
              <div class="info-box">
                <p><strong>📦 Важна информация за доставка:</strong></p>
                <p>Вашата поръчка е в процес на доставка. Ще получите номер за проследяване от куриера по имейл или SMS.</p>
              </div>
            ` : ''}

            ${newStatus === 'DELIVERED' ? `
              <div class="info-box">
                <p><strong>🎉 Благодарим ви за покупката!</strong></p>
                <p>Надяваме се да сте доволни от продуктите. Ще се радваме да споделите отзив.</p>
              </div>
            ` : ''}

            ${newStatus === 'CANCELLED' ? `
              <div class="info-box">
                <p><strong>ℹ️ Имате въпроси?</strong></p>
                <p>Ако имате въпроси относно отказаната поръчка, моля свържете се с нас.</p>
              </div>
            ` : ''}

            <div style="text-align: center;">
              <a href="${siteUrl}/order-confirmation/${orderId}" class="button">
                Виж детайли на поръчката
              </a>
            </div>

            <p>Ако имате въпроси, не се колебайте да се свържете с нас.</p>
          </div>

          <div class="footer">
            <p><strong>${process.env.APP_NAME}</strong></p>
            <p>${appDescription}</p>
            <p style="margin-top: 15px;">
              <a href="${siteUrl}/contact">Контакти</a> •
              <a href="${siteUrl}">Начало</a> •
              <a href="${siteUrl}/products">Продукти</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject: `Актуализация на поръчка #${orderNumber} - ${statusTranslations[newStatus]}`,
      html,
    });

    if (error) {
      console.error("Error sending status update email:", error);
      return { success: false, error };
    }

    console.log("Status update email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending status update email:", error);
    return { success: false, error };
  }
}
