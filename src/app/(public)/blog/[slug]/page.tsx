import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/actions/blog";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RichTextViewer } from "@/components/RichTextViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад към блога
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.createdAt).toLocaleDateString("bg-BG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <RichTextViewer content={post.content} />
          </div>
        </div>
      </article>
    </div>
  );
}
