import Link from "next/link";
import { Plus, Image as ImageIcon } from "lucide-react";
import { getGalleryImages, deleteGalleryImage } from "@/actions/misc";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import Image from "next/image";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <PageHeader
        title="Галерия"
        description="Управление на изображенията в галерията"
        actions={
          <Link
            href="/admin/gallery/new"
            className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Добави изображение</span>
          </Link>
        }
      />

      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма изображения
          </h3>
          <p className="text-gray-600 mb-6">
            Започнете като добавите първото си изображение
          </p>
          <Link
            href="/admin/gallery/new"
            className="inline-flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Добави изображение</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={image.image}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
                {image.featured && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-amber-500 text-white rounded">
                    Препоръчано
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {image.description}
                  </p>
                )}
                {image.category && (
                  <span className="text-xs text-gray-500">
                    {image.category}
                  </span>
                )}
              </div>
              <div className="px-4 pb-4">
                <DeleteButton
                  id={image.id}
                  action={deleteGalleryImage}
                  confirmTitle="Изтриване на изображение"
                  confirmMessage="Сигурни ли сте, че искате да изтриете това изображение?"
                  iconOnly={false}
                  className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-900 border border-red-300 hover:border-red-500 px-3 py-2 rounded transition"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
