<script src="https://t.contentsquare.net/uxa/039a40ead9180.js"></script>
import { getGalleryImages } from "@/actions/misc";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Галерия
            </h1>
            <p className="text-xl text-gray-600">
              Вижте нашите завършени проекти и реализации
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                Все още няма изображения в галерията.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition">
                      <h3 className="font-semibold">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-gray-200">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
