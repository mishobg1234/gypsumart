"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBanner, updateBanner } from "@/actions/banners";
import { BannerImageUploader } from "./BannerImageUploader";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  images: string; // JSON string
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  active: boolean;
}

interface BannerFormProps {
  banner?: Banner;
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    banner?.images ? JSON.parse(banner.images) : []
  );

  const [formData, setFormData] = useState({
    title: banner?.title || "",
    description: banner?.description || "",
    buttonText: banner?.buttonText || "",
    buttonLink: banner?.buttonLink || "",
    order: banner?.order ?? 0,
    active: banner?.active ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseInt(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert("Моля, добавете поне едно изображение");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        ...formData,
        images: JSON.stringify(images),
      };

      const result = banner
        ? await updateBanner(banner.id, data)
        : await createBanner(data);

      if (result.success) {
        router.push("/admin/banners");
        router.refresh();
      } else {
        alert(result.error || "Грешка при запазване на банер");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Грешка при запазване на банер");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Изображения
        </h2>
        <BannerImageUploader images={images} onImagesChange={setImages} />
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Основна информация
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заглавие
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Заглавие на банера"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Кратко описание"
            />
          </div>
        </div>
      </div>

      {/* Button Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Настройки на бутона
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст на бутона
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Например: Научи повече"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Линк на бутона
            </label>
            <input
              type="text"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="/products"
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Настройки за показване
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ред на показване
            </label>
            <input
              type="number"
              name="order"
              min="0"
              value={formData.order}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              По-ниската стойност се показва първа
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Активен банер
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/banners"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Назад</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading
            ? "Запазване..."
            : banner
            ? "Обнови банер"
            : "Създай банер"}
        </button>
      </div>
    </form>
  );
}
