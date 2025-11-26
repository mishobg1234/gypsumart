import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { formatPriceHTML } from "@/lib/currency";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    images: string;
    inStock: boolean;
    category: {
      name: string;
    };
    reviews?: Array<{ rating: number }>;
    _count?: {
      reviews: number;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = JSON.parse(product.images) as string[];
  
  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  const reviewCount = product._count?.reviews || product.reviews?.length || 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group block"
    >
      <div className="relative h-64 bg-gray-100">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-20 w-20 text-gray-300" />
          </div>
        )}
        
        {/* Sale Badge */}
        {product.compareAtPrice && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-bold">
            ПРОМОЦИЯ
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium">
            Изчерпан
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-amber-600 font-medium">
            {product.category.name}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
          {product.name}
        </h3>
        
        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${
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
            <span className="ml-1 text-xs text-gray-600">
              ({reviewCount})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-amber-600">
              {formatPriceHTML(product.price).full}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-gray-500 line-through">
                {formatPriceHTML(product.compareAtPrice).full}
              </p>
            )}
          </div>
          <span className="bg-amber-600 text-white px-4 py-2 rounded-lg group-hover:bg-amber-700 transition text-sm font-medium">
            Поръчай
          </span>
        </div>
      </div>
    </Link>
  );
}
