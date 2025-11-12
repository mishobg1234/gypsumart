import { Star } from "lucide-react";
import { getReviews, approveReview, deleteReview } from "@/actions/misc";
import { PageHeader } from "@/components/admin/PageHeader";
import { ApproveButton } from "@/components/admin/ApproveButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Отзиви"
        description="Управление на отзивите от клиенти"
      />

      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма отзиви
          </h3>
          <p className="text-gray-600">
            Все още няма публикувани отзиви
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {review.name}
                    </h3>
                    {renderStars(review.rating)}
                    {review.approved ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Одобрен
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Чака одобрение
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.email}</p>
                  {review.product && (
                    <p className="text-sm text-gray-500 mb-3">
                      Продукт: {review.product.name}
                    </p>
                  )}
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!review.approved && (
                    <ApproveButton
                      id={review.id}
                      action={approveReview}
                    />
                  )}
                  <DeleteButton
                    id={review.id}
                    action={deleteReview}
                    confirmTitle="Изтриване на отзив"
                    confirmMessage="Сигурни ли сте, че искате да изтриете този отзив?"
                    className="text-red-600 hover:text-red-900 p-2 border border-red-300 hover:border-red-500 rounded transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
