import Link from "next/link";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductCard } from "@/components/product";

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const searchQuery = typeof params.search === "string" ? params.search : undefined;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;

  const [allProducts, categories] = await Promise.all([
    getProducts(undefined, searchQuery),
    getCategories(),
  ]);

  // Филтриране по категория ако има
  let products = allProducts;
  if (categorySlug && !searchQuery) {
    const category = categories.find((cat) => cat.slug === categorySlug);
    if (category) {
      products = allProducts.filter((product) => product.categoryId === category.id);
    }
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {searchQuery ? `Резултати за "${searchQuery}"` : "Онлайн магазин"}
            </h1>
            <p className="text-xl text-gray-600">
              {searchQuery
                ? `Намерени ${products.length} ${products.length === 1 ? "продукт" : "продукта"}`
                : "Разгледайте нашата богата колекция от гипсови изделия"}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categories Filter - скриваме го при търсене */}
          {!searchQuery && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/shop"
                className={`px-4 py-2 rounded-lg transition ${
                  !categorySlug
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Всички
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className={`px-4 py-2 rounded-lg transition ${
                    categorySlug === category.slug
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Бутон за изчистване на търсенето */}
          {searchQuery && (
            <div className="mb-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ← Назад към всички продукти
              </Link>
            </div>
          )}

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
