"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPriceHTML } from "@/lib/currency";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Зареждане...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Вашата кошница е празна
            </h1>
            <p className="text-gray-600 mb-8">
              Добавете продукти в кошницата, за да направите поръчка
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Към продуктите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Продължи пазаруването
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Кошница</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6"
              >
                {/* Image */}
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  {item.image ? (
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-green-600 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-green-600 font-bold mt-2">
                    {formatPriceHTML(item.price).full}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[120px]">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPriceHTML(item.price * item.quantity).full}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Обобщение</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Продукти ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span className="font-semibold">{formatPriceHTML(totalPrice).full}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Общо</span>
                    <span className="text-green-600">{formatPriceHTML(totalPrice).full}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold mb-3"
              >
                Продължи към поръчка
              </Link>

              <button
                onClick={clearCart}
                className="w-full px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
              >
                Изчисти кошницата
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
