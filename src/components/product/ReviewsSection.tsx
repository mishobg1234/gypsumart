"use client";

import { useState } from "react";
import { ReviewForm } from "./ReviewForm";

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  reviews: Array<{
    id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
}

export function ReviewsSection({ productId, productName, reviews }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Отзиви {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {/* Existing Reviews */}
      {reviews.length > 0 ? (
        <>
          <div className="space-y-6 mb-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-3 font-semibold text-gray-900">
                    {review.name}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString("bg-BG")}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          
          {/* Review Form - After reviews */}
          {showForm ? (
            <div>
              <ReviewForm
                productId={productId}
                productName={productName}
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                ⭐ Оставете отзив
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Empty state */}
          {!showForm && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Все още няма отзиви за този продукт
              </h3>
              <p className="text-gray-600 mb-6">
                Бъдете първият, който споделя мнение за {productName}!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                ⭐ Оставете отзив
              </button>
            </div>
          )}
          
          {/* Review Form */}
          {showForm && (
            <div>
              <ReviewForm
                productId={productId}
                productName={productName}
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
