import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/actions/blog";
import { Calendar, FileText } from "lucide-react";

export default async function BlogPage() {
  const posts = await getBlogPosts(true);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Блог
            </h1>
            <p className="text-xl text-gray-600">
              Полезни статии и съвети за гипсови изделия
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                Все още няма публикации.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {post.image ? (
                    <div className="relative aspect-video bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(post.createdAt).toLocaleDateString("bg-BG")}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
