import { notFound } from "next/navigation";
import { getPageBySlug } from "@/actions/pages";
import type { Metadata } from "next";
import { RichTextViewer } from "@/components/RichTextViewer";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page || !page.published) {
    return {
      title: "Страницата не е намерена",
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page.title}
        </h1>
        
        <RichTextViewer content={page.content} />
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Последна актуализация: {new Date(page.updatedAt).toLocaleDateString("bg-BG", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </article>
    </div>
  );
}
