"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/actions/blog";
import { BlogPost } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlogImageUploader } from "./BlogImageUploader";
import { RichTextEditor } from "./RichTextEditor";
import { generateSlug } from "@/lib/slugify";

interface BlogFormProps {
  post?: BlogPost;
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(post?.image || null);
  const [content, setContent] = useState(post?.content || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: (formData.get("excerpt") as string) || undefined,
      content: content,
      image: imageUrl || undefined,
      published: formData.get("published") === "on",
    };

    const result = post
      ? await updateBlogPost(post.id, data)
      : await createBlogPost(data);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Информация за публикацията
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
              defaultValue={post?.title}
              onChange={(e) => {
                const slugInput = document.getElementsByName("slug")[0] as HTMLInputElement;
                if (!post) {
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
              defaultValue={post?.slug}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Кратко описание
            </label>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Съдържание *
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Напишете съдържанието на публикацията..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изображение
            </label>
            <BlogImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post?.published}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Публикувай</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
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
            : post
            ? "Обнови публикация"
            : "Създай публикация"}
        </button>
      </div>
    </form>
  );
}
