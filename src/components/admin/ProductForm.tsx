"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/products";
import { Category, Product } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductImageUploader } from "./ProductImageUploader";
import { RichTextEditor } from "./RichTextEditor";
import { generateSlug } from "@/lib/slugify";

interface ProductFormProps {
  product?: Product & { category: Category };
  categories: (Category & { _count: { products: number } })[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(
    product ? JSON.parse(product.images) : []
  );
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(product?.metaDescription || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      shortDescription: shortDescription,
      description: description,
      price: parseFloat(formData.get("price") as string),
      compareAtPrice: formData.get("compareAtPrice")
        ? parseFloat(formData.get("compareAtPrice") as string)
        : undefined,
      images: JSON.stringify(images),
      featured: formData.get("featured") === "on",
      inStock: formData.get("inStock") === "on",
      sku: formData.get("sku") as string,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      categoryId: formData.get("categoryId") as string,
    };

    const result = product
      ? await updateProduct(product.id, data)
      : await createProduct(data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/products");
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Основна информация
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Име на продукта *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={product?.name}
              onChange={(e) => {
                const slugInput = document.getElementsByName("slug")[0] as HTMLInputElement;
                if (!product) {
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
              defaultValue={product?.slug}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Кратко описание
            </label>
            <textarea
              name="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              placeholder="Кратко описание което ще се показва под бутона 'Добави в кошницата'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пълно описание
            </label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Напишете пълно описание на продукта..."
            />
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              SEO оптимизация
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Оставете празно за автоматично генериране от името на продукта"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Препоръчителна дължина: 50-60 символа
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder="Оставете празно за автоматично генериране от краткото описание"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Препоръчителна дължина: 150-160 символа
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (€) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                defaultValue={product?.price}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сравнителна цена (€)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                step="0.01"
                defaultValue={product?.compareAtPrice || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                defaultValue={product?.sku || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={product?.categoryId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Изберете категория</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Препоръчан продукт</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                defaultChecked={product?.inStock ?? true}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">В наличност</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Изображения</h2>
        <ProductImageUploader images={images} onImagesChange={setImages} />
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
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
          {isLoading
            ? "Запазване..."
            : product
            ? "Обнови продукт"
            : "Създай продукт"}
        </button>
      </div>
    </form>
  );
}
