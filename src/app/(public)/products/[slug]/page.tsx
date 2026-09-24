import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import Link from "next/link";
import { ProductCard } from "@/components/product";
import { CatalogPagination } from "@/components/product/CatalogPagination";
import { getCatalogPage, parseCatalogPage } from "@/lib/catalog";

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { slug } = await params;
  const page = parseCatalogPage((await searchParams).page);
  
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      children: {
        select: { id: true, slug: true, name: true, description: true,
          _count: { select: { products: { where: { inStock: true } } } } },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const { products, totalPages } = await getCatalogPage({
    inStock: true,
    categoryId: { in: [category.id, ...category.children.map((child) => child.id)] },
  }, page);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Subcategories */}
        {category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Подкатегории
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.children.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/products/${subcategory.slug}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subcategory.name}
                  </h3>
                  {subcategory.description && (
                    <p className="text-gray-600 text-sm">
                      {subcategory.description}
                    </p>
                  )}
                  <p className="text-green-600 mt-4 text-sm font-medium">
                    {subcategory._count.products} продукта
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Продукти</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <CatalogPagination page={page} totalPages={totalPages} href={(nextPage) => `/products/${slug}?page=${nextPage}`} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Няма налични продукти
            </h3>
            <p className="text-gray-600">
              В момента няма продукти в тази категория. Моля, проверете
              по-късно.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
