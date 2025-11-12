"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Package, Mail, Phone, MapPin, Truck, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  deliveryFee: number;
  courier: string;
  trackingNumber?: string;
  deliveryMethod: string;
  deliveryOffice?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Поръчката не е намерена
          </h1>
          <p className="text-gray-600 mb-6">
            Не успяхме да открием поръчка с този номер
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            Обратно към продуктите
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Animation Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Поръчката е приета успешно!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Благодарим ви за доверието! 🎉
          </p>

          <div className="inline-block bg-gradient-to-r from-amber-50 to-green-50 px-8 py-4 rounded-xl border-2 border-amber-200">
            <p className="text-sm text-gray-600 mb-1">Номер на поръчка</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              Изпратихме потвърждение на <span className="font-semibold text-gray-900">{order.customerEmail}</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Вашата поръчка</h2>
            </div>

            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {item.price.toFixed(2)} лв
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {(item.quantity * item.price).toFixed(2)} лв
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t-2">
              <div className="flex justify-between text-gray-600">
                <span>Продукти</span>
                <span>{(order.totalAmount - order.deliveryFee).toFixed(2)} лв</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span className={order.deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                  {order.deliveryFee === 0 ? "Безплатна ✓" : `${order.deliveryFee.toFixed(2)} лв`}
                </span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t">
                <span>Обща сума</span>
                <span className="bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                  {order.totalAmount.toFixed(2)} лв
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Delivery Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Данни за контакт</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Имейл</p>
                    <p className="font-medium text-gray-900">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-medium text-gray-900">{order.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-bold text-gray-900 text-lg">Доставка</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Куриер</p>
                  <p className="font-semibold text-gray-900">
                    {order.courier === "speedy" ? "Спиди" : "Еконт"}
                  </p>
                </div>
                
                {order.trackingNumber && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Номер за проследяване</p>
                    <p className="font-mono font-bold text-green-700 text-lg">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
                
                {order.deliveryMethod === "office" ? (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">До офис</p>
                      <p className="font-medium text-gray-900">{order.deliveryOffice}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">До адрес</p>
                      <p className="font-medium text-gray-900">
                        {order.deliveryCity}, {order.deliveryAddress}
                        {order.deliveryPostalCode && `, ${order.deliveryPostalCode}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Начин на плащане</p>
                  <p className="font-semibold text-gray-900">💰 Наложен платеж</p>
                  <p className="text-xs text-gray-500 mt-1">Плащате при получаване</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">📋</span>
            Следващи стъпки
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Потвърждение</p>
                <p className="text-sm text-gray-600">Получихте имейл с детайли за поръчката</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Обаждане</p>
                <p className="text-sm text-gray-600">Ще ви се обадим за потвърждаване</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Обработка</p>
                <p className="text-sm text-gray-600">Подготвяме поръчката за изпращане (1-2 дни)</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">4️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Проследяване</p>
                <p className="text-sm text-gray-600">Получавате номер за следене от куриера</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition font-bold text-lg shadow-lg hover:shadow-xl"
          >
            <Package className="mr-2 h-6 w-6" />
            Продължи пазаруването
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition font-bold text-lg shadow-lg hover:shadow-xl"
          >
            <Mail className="mr-2 h-6 w-6" />
            Свържете се с нас
          </Link>
        </div>

        {/* Print Receipt */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="text-sm">Принтирай потвърждение</span>
          </button>
        </div>
      </div>
    </div>
  );
}
