"use client";

import { useState } from "react";
import { createReview } from "@/actions/misc";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, productName, onSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await createReview({
        productId,
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setFormData({ name: "", email: "", rating: 5, comment: "" });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setError("Нещо се обърка. Моля, опитайте отново.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-900 mb-2">
          Благодарим за отзива!
        </h3>
        <p className="text-green-700 mb-4">
          Вашият отзив беше изпратен успешно и ще бъде публикуван след одобрение от нашия екип.
        </p>
        <button
          onClick={onCancel}
          className="text-green-700 hover:text-green-900 font-medium"
        >
          Затвори
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Оставете отзив за {productName}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Затвори"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Оценка *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`h-8 w-8 ${
                    star <= (hoveredStar || formData.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({formData.rating} {formData.rating === 1 ? "звезда" : "звезди"})
            </span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-2">
            Вашето име *
          </label>
          <input
            type="text"
            id="review-name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Иван Иванов"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="review-email" className="block text-sm font-medium text-gray-700 mb-2">
            Имейл адрес *
          </label>
          <input
            type="email"
            id="review-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="ivan@example.com"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Имейлът няма да бъде публикуван
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Вашият отзив *
          </label>
          <textarea
            id="review-comment"
            required
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Споделете вашето мнение за продукта..."
            disabled={loading}
            minLength={10}
          />
          <p className="mt-1 text-xs text-gray-500">
            Минимум 10 символа
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ Отзивът ви ще бъде прегледан от нашия екип преди публикуване.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {loading ? "Изпращане..." : "Изпрати отзив"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Отказ
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
