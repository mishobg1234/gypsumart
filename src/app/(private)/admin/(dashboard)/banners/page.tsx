import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, EyeOff } from "lucide-react";
import { getBanners } from "@/actions/banners";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBanner } from "@/actions/banners";
import { PageHeader } from "@/components/admin/PageHeader";

interface Banner {
  id: string;
  title: string | null;
  description: string | null;
  images: string;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  active: boolean;
}

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Банери"
        description="Управление на банери за главната страница"
        actions={
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добави банер
          </Link>
        }
      />

      {banners.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">Няма добавени банери</p>
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добави първи банер
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: Banner) => {
            const images = JSON.parse(banner.images) as string[];
            const firstImage = images[0] || "/placeholder.jpg";
            
            return (
              <div
                key={banner.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={firstImage}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    {banner.active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Активен
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        Неактивен
                      </span>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-black/60 text-white text-xs font-semibold rounded">
                        {images.length} изображения
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {banner.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Ред: {banner.order}</span>
                    {banner.buttonText && (
                      <span className="text-green-600">{banner.buttonText}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/banners/${banner.id}/edit`}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition text-center font-medium"
                    >
                      Редактирай
                    </Link>
                    <DeleteButton
                      id={banner.id}
                      action={deleteBanner}
                      className="px-4 py-2"
                      iconOnly={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
