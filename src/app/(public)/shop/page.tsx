<script src="https://t.contentsquare.net/uxa/039a40ead9180.js"></script>
import Link from "next/link";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductCard } from "@/components/product";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Онлайн магазин
            </h1>
            <p className="text-xl text-gray-600">
              Разгледайте нашата богата колекция от гипсови изделия
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categories Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/shop"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Всички
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                Все още няма продукти в магазина.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
