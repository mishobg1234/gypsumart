"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
  currentTrackingNumber?: string | null;
  action: (id: string, status: OrderStatus, trackingNumber?: string) => Promise<{ error?: string; success?: string }>;
}

export function OrderStatusForm({ orderId, currentStatus, currentTrackingNumber, action }: OrderStatusFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Проверка дали е избран статус SHIPPED и няма tracking number
    if (status === "SHIPPED" && !trackingNumber.trim()) {
      setError("Моля, въведете номер за проследяване за изпратена поръчка");
      return;
    }

    startTransition(async () => {
      const result = await action(orderId, status, trackingNumber.trim() || undefined);
      if (result.success) {
        router.refresh();
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  const showTrackingInput = status === "SHIPPED";

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Промени статус
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isPending}
        >
          <option value="PENDING">Чакаща</option>
          <option value="PROCESSING">Обработва се</option>
          <option value="SHIPPED">Изпратена</option>
          <option value="DELIVERED">Доставена</option>
          <option value="CANCELLED">Отказана</option>
        </select>
      </div>

      {showTrackingInput && (
        <div>
          <label
            htmlFor="trackingNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Номер за проследяване <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Въведете номер за проследяване"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required={showTrackingInput}
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            Задължително поле за изпратени поръчки
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
      >
        {isPending ? "Обновява се..." : "Обнови статус"}
      </button>
    </form>
  );
}

