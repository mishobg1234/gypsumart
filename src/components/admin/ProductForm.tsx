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
import { euroToBgn } from "@/lib/currency";

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
  const [metaKeywords, setMetaKeywords] = useState(product?.metaKeywords || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() || "");
  const [pricePerCustom, setPricePerCustom] = useState(product?.pricePerCustom?.toString() || "");
  const [customPriceLabel, setCustomPriceLabel] = useState(product?.customPriceLabel || "");

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
      pricePerCustom: formData.get("pricePerCustom")
        ? parseFloat(formData.get("pricePerCustom") as string)
        : undefined,
      customPriceLabel: formData.get("customPriceLabel") as string || undefined,
      whichPriceShouldBeInCart: formData.get("whichPriceShouldBeInCart") === "on",
      showSecondaryCartButton: formData.get("showSecondaryCartButton") === "on",
      images: JSON.stringify(images),
      featured: formData.get("featured") === "on",
      inStock: formData.get("inStock") === "on",
      sku: formData.get("sku") as string,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      metaKeywords: metaKeywords || undefined,
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
                slugInput.value = generateSlug(e.target.value);
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="гипсови изделия, декорация, строителство (разделени със запетая)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Въведете ключови думи, разделени със запетая
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {price && parseFloat(price) > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  = {euroToBgn(parseFloat(price)).toFixed(2)} лв.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сравнителна цена (€)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {compareAtPrice && parseFloat(compareAtPrice) > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  = {euroToBgn(parseFloat(compareAtPrice)).toFixed(2)} лв.
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Допълнителна цена (по избор)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена по поръчка (€)
                </label>
                <input
                  type="number"
                  name="pricePerCustom"
                  step="0.01"
                  value={pricePerCustom}
                  onChange={(e) => setPricePerCustom(e.target.value)}
                  placeholder="Например: цена за м2, за пакет..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {pricePerCustom && parseFloat(pricePerCustom) > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    = {euroToBgn(parseFloat(pricePerCustom)).toFixed(2)} лв.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Етикет за допълнителна цена
                </label>
                <input
                  type="text"
                  name="customPriceLabel"
                  value={customPriceLabel}
                  onChange={(e) => setCustomPriceLabel(e.target.value)}
                  placeholder='Например: "на м2", "за пакет (1 пакет - 1.25м2)"'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ще се показва като: "Цена {customPriceLabel}"
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="showSecondaryCartButton"
                  defaultChecked={product?.showSecondaryCartButton || false}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  Показвай втори бутон за добавяне в кошницата с допълнителната цена
                </span>
              </label>
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
              <span className="ml-2 text-sm text-gray-700">Изчерпан (показва се на началната страница)</span>
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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
