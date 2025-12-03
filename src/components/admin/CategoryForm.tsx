"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/categories";
import { Category } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/slugify";

interface CategoryFormProps {
  category?: Category;
  categories: (Category & { _count: { products: number } })[];
}

export function CategoryForm({ category, categories }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
      parentId: (formData.get("parentId") as string) || undefined,
    };

    const result = category
      ? await updateCategory(category.id, data)
      : await createCategory(data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/categories");
      router.refresh();
    }

    setIsLoading(false);
  };

  // Filter out current category and its children from parent options
  const availableParents = categories.filter(
    (cat) => cat.id !== category?.id && cat.parentId !== category?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Информация за категорията
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Име на категорията *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={category?.name}
              onChange={(e) => {
                const slugInput = document.getElementsByName("slug")[0] as HTMLInputElement;
                if (!category) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={category?.slug}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={category?.description || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL на изображение
            </label>
            <input
              type="text"
              name="image"
              defaultValue={category?.image || ""}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Родителска категория
            </label>
            <select
              name="parentId"
              defaultValue={category?.parentId || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Няма (Основна категория)</option>
              {availableParents.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading
            ? "Запазване..."
            : category
            ? "Обнови категория"
            : "Създай категория"}
        </button>
      </div>
    </form>
  );
}
