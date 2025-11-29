<script src="https://t.contentsquare.net/uxa/039a40ead9180.js"></script>
import { prisma } from "@/db/prisma";
import Link from "next/link";
import { ProductCard } from "@/components/product";

export default async function AllProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      include: {
        category: true,
        reviews: {
          where: { approved: true },
        },
        _count: {
          select: { reviews: { where: { approved: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Всички продукти
          </h1>
          <p className="text-lg text-gray-600">
            Разгледайте пълната ни колекция от гипсови изделия
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                )}
                {category.children.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Подкатегории:
                    </p>
                    <ul className="space-y-1">
                      {category.children.slice(0, 3).map((child) => (
                        <li
                          key={child.id}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2"></span>
                          {child.name}
                        </li>
                      ))}
                      {category.children.length > 3 && (
                        <li className="text-sm text-gray-500 italic">
                          +{category.children.length - 3} още
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* All Products */}
        {products.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Всички продукти ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Няма налични продукти
            </h3>
            <p className="text-gray-600">
              В момента няма продукти в каталога. Моля, проверете по-късно.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
