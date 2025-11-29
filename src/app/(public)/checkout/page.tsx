<script src="https://t.contentsquare.net/uxa/039a40ead9180.js"></script>
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPriceHTML } from "@/lib/currency";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && items.length === 0 && !processingOrder) {
      router.push("/cart");
    }
  }, [isClient, items.length, router, processingOrder]);

  // Изчисление на доставката
  const FREE_DELIVERY_THRESHOLD = 40; // Безплатна доставка над 80 €
  const DELIVERY_PRICE = 3; // Стандартна цена на доставка
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_PRICE;
  const finalTotal = totalPrice + deliveryFee;

  const [formData, setFormData] = useState({
    // Лични данни
    fullName: "",
    email: "",
    phone: "",
    // Данни за доставка
    deliveryMethod: "office", // office или address
    courier: "speedy", // speedy или econt
    office: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProcessingOrder(true);

    try {
      // Валидация
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error("Моля, попълнете всички задължителни полета");
      }

      if (formData.deliveryMethod === "office" && !formData.office) {
        throw new Error("Моля, посочете офис за доставка");
      }

      if (formData.deliveryMethod === "address" && (!formData.address || !formData.city)) {
        throw new Error("Моля, посочете адрес и град за доставка");
      }

      // Подготовка на данните за поръчката
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: finalTotal,
        deliveryFee: deliveryFee,
      };

      // Изпращане на поръчката
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Грешка при създаване на поръчка");
      }

      const result = await response.json();

      if (!result.success || !result.orderId) {
        throw new Error("Невалиден отговор от сървъра");
      }

      // Първо редиректваме (важно е преди clearCart!)
      const confirmationUrl = `/order-confirmation/${result.orderId}`;
      
      // Изчистваме кошницата
      clearCart();
      
      // Използваме window.location за сигурен redirect
      window.location.href = confirmationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка");
      setProcessingOrder(false); // Важно: reset при грешка
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-amber-600 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад към кошницата
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Поръчка</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Лични данни */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Лични данни
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Име и фамилия *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имейл *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="+359 888 123 456"
                    />
                  </div>
                </div>
              </div>

              {/* Данни за доставка */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Данни за доставка
                </h2>
                <div className="space-y-4">
                  {/* Куриер */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Куриер *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <input
                          type="radio"
                          name="courier"
                          value="speedy"
                          checked={formData.courier === "speedy"}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-3 font-medium">Спиди</span>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <input
                          type="radio"
                          name="courier"
                          value="econt"
                          checked={formData.courier === "econt"}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-3 font-medium">Еконт</span>
                      </label>
                    </div>
                  </div>

                  {/* Метод на доставка */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Метод на доставка *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="office"
                          checked={formData.deliveryMethod === "office"}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-3 font-medium">До офис</span>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="address"
                          checked={formData.deliveryMethod === "address"}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-3 font-medium">До адрес</span>
                      </label>
                    </div>
                  </div>

                  {/* До офис */}
                  {formData.deliveryMethod === "office" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Офис на {formData.courier === "speedy" ? "Спиди" : "Еконт"} *
                      </label>
                      <input
                        type="text"
                        name="office"
                        required={formData.deliveryMethod === "office"}
                        value={formData.office}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Например: София, бул. Витоша 1"
                      />
                    </div>
                  )}

                  {/* До адрес */}
                  {formData.deliveryMethod === "address" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Град *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required={formData.deliveryMethod === "address"}
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="София"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Адрес *
                        </label>
                        <input
                          type="text"
                          name="address"
                          required={formData.deliveryMethod === "address"}
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="ул. Примерна 123, ап. 45"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Пощенски код
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="1000"
                        />
                      </div>
                    </>
                  )}

                  {/* Бележки */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Бележки към поръчката
                    </label>
                    <textarea
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Допълнителна информация..."
                    />
                  </div>
                </div>
              </div>

              {/* Начин на плащане */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Начин на плащане
                </h2>
                <div className="flex items-center p-4 bg-amber-50 border-2 border-amber-600 rounded-lg">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked
                    readOnly
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      Наложен платеж
                    </p>
                    <p className="text-sm text-gray-600">
                      Плащате при получаване на пратката
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Обработване...
                  </>
                ) : (
                  "Завърши поръчката"
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Поръчка
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">
                        {item.quantity} x {formatPriceHTML(item.price).full}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatPriceHTML(item.quantity * item.price).full}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Продукти</span>
                  <span>{formatPriceHTML(totalPrice).full}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span>{deliveryFee === 0 ? "Безплатна" : formatPriceHTML(deliveryFee).full}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Обща сума</span>
                  <span className="text-amber-600">{formatPriceHTML(finalTotal).full}</span>
                </div>
              </div>

              {deliveryFee === 0 ? (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    ✓ Безплатна доставка
                  </p>
                  <p className="text-sm text-green-700">
                    Поръчката ви е над {formatPriceHTML(FREE_DELIVERY_THRESHOLD).bgn} и получавате безплатна доставка!
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">ℹ️ Информация за доставка:</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    • Безплатна доставка за поръчки над {formatPriceHTML(FREE_DELIVERY_THRESHOLD).full}
                  </p>
                  <p className="text-sm text-gray-600">
                    • Стандартна цена: {formatPriceHTML(DELIVERY_PRICE).full} (ориентировъчна)
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    * Крайната цена на доставката може да варира в зависимост от куриера и местоназначението
                  </p>
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    💡 Добавете продукти за още {formatPriceHTML(FREE_DELIVERY_THRESHOLD - totalPrice).full} за безплатна доставка
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
