import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton, ProductImageGallery, ReviewsSection } from "@/components/product";
import { RichTextViewer } from "@/components/RichTextViewer";
import { formatPriceHTML, euroToBgn } from "@/lib/currency";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      shortDescription: true,
      price: true,
      images: true,
    },
  });

  if (!product) {
    return {
      title: "Продукт не е намерен",
    };
  }

  const images = JSON.parse(product.images) as string[];
  const priceInBgn = euroToBgn(product.price);

  return {
    title: product.metaTitle || `${product.name} - ArtBuildShop`,
    description: product.metaDescription || product.shortDescription || `Купете ${product.name} на отлична цена - ${priceInBgn.toFixed(2)} лв.`,
    keywords: product.metaKeywords || undefined,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || `Купете ${product.name} на отлична цена`,
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const images = JSON.parse(product.images) as string[];
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/products/${product.category.slug}`}
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад към {product.category.name}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="relative">
            {/* Sale Badge */}
            {product.compareAtPrice && (
              <div className="absolute top-0 left-0 z-10 bg-red-600 text-white px-4 py-2 rounded-br-lg rounded-tl-lg shadow-lg">
                <p className="text-base font-bold uppercase">Промоция</p>
              </div>
            )}
            <ProductImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <Link
                href={`/products/${product.category.slug}`}
                className="text-sm text-green-600 hover:text-green-700 mb-2 inline-block"
              >
                {product.category.name}
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-600 mb-4">
                  Артикул: <span className="font-medium">{product.sku}</span>
                </p>
              )}
              
              {/* Rating */}
              {product.reviews.length > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${
                          star <= averageRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({product.reviews.length} отзива)
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  В наличност
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Изчерпан
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="grid gap-4">
                {/* Редовна цена */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Цена на брой</p>
                  <div className="flex items-baseline space-x-4">
                    <p className="text-4xl font-bold text-green-600">
                      {formatPriceHTML(product.price).full}
                    </p>
                    {product.compareAtPrice && (
                      <p className="text-2xl text-gray-500 line-through">
                        {formatPriceHTML(product.compareAtPrice).full}
                      </p>
                    )}
                  </div>
                  {product.compareAtPrice && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                      <span className="text-lg">💰</span>
                      <span className="text-sm font-semibold">
                        Спестявате {formatPriceHTML(product.compareAtPrice - product.price).full}
                      </span>
                    </div>
                  )}
                </div>

                {/* Допълнителна цена (ако има) */}
                {product.pricePerCustom && product.customPriceLabel && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Цена {product.customPriceLabel}
                    </p>
                    <p className="text-4xl font-bold text-green-600">
                      {formatPriceHTML(product.pricePerCustom).full}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.whichPriceShouldBeInCart && product.pricePerCustom 
                  ? product.pricePerCustom 
                  : product.price,
                image: images[0],
              }}
            />
            
            <p className="text-sm text-gray-600 text-center mt-4">
              Или се свържете с нас за поръчка на{" "}
              <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
                страницата за контакти
              </Link>
            </p>
          </div>
        </div>

        {/* Description - Full Width */}
        {product.description && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Описание
            </h2>
            <RichTextViewer content={product.description} />
          </div>
        )}
        </div>

        {/* Reviews */}
        <ReviewsSection
          productId={product.id}
          productName={product.name}
          reviews={product.reviews}
        />
      </div>
    </div>
  );
}
