"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGalleryImage } from "@/actions/misc";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GalleryImageUploader } from "./GalleryImageUploader";

export function GalleryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!imageUrl) {
      setError("Моля, добавете изображение");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      image: imageUrl,
      category: (formData.get("category") as string) || undefined,
      featured: formData.get("featured") === "on",
    };

    const result = await createGalleryImage(data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/gallery");
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Информация за изображението
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заглавие *
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изображение *
            </label>
            <GalleryImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <input
              type="text"
              name="category"
              placeholder="напр. Таван, Стена, Декорация"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Препоръчано изображение</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/gallery"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
        >
          {isLoading ? "Запазване..." : "Добави изображение"}
        </button>
      </div>
    </form>
  );
}
