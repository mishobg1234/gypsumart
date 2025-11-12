"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/actions/pages";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/slugify";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  showInNavbar: boolean;
  showInFooter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PageFormProps {
  page?: Page;
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      metaTitle: (formData.get("metaTitle") as string) || undefined,
      metaDescription: (formData.get("metaDescription") as string) || undefined,
      published: formData.get("published") === "on",
      showInNavbar: formData.get("showInNavbar") === "on",
      showInFooter: formData.get("showInFooter") === "on",
    };

    const result = page
      ? await updatePage(page.id, data)
      : await createPage(data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/pages");
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
              Заглавие *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={page?.title}
              onChange={(e) => {
                const slugInput = document.getElementsByName("slug")[0] as HTMLInputElement;
                if (!page) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL адрес) *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">/</span>
              <input
                type="text"
                name="slug"
                required
                defaultValue={page?.slug}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Това ще бъде URL адресът на страницата (напр. "about" за /about)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Съдържание *
            </label>
            <textarea
              name="content"
              rows={15}
              required
              defaultValue={page?.content}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              placeholder="HTML съдържание на страницата..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Можете да използвате HTML тагове за форматиране
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                defaultChecked={page?.published ?? true}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Публикувана страница</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showInNavbar"
                defaultChecked={page?.showInNavbar ?? false}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Покажи в навигацията (header)</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showInFooter"
                defaultChecked={page?.showInFooter ?? true}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Покажи във футъра (footer)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          SEO настройки
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta заглавие
            </label>
            <input
              type="text"
              name="metaTitle"
              defaultValue={page?.metaTitle || ""}
              placeholder="Заглавие за търсачки (ако е празно, ще се използва основното заглавие)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta описание
            </label>
            <textarea
              name="metaDescription"
              rows={3}
              defaultValue={page?.metaDescription || ""}
              placeholder="Кратко описание за търсачки (150-160 символа)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/pages"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад</span>
        </Link>

        <div className="flex items-center space-x-3">
          {page && (
            <Link
              href={`/${page.slug}`}
              target="_blank"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Преглед
            </Link>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
          >
            {isLoading
              ? "Запазване..."
              : page
              ? "Обнови страница"
              : "Създай страница"}
          </button>
        </div>
      </div>
    </form>
  );
}
