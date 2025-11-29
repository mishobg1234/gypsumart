<script src="https://t.contentsquare.net/uxa/039a40ead9180.js"></script>
import Link from "next/link";
import { ArrowRight, Package, Building2, Star, Grid3x3 } from "lucide-react";
import { getFeaturedProducts } from "@/actions/products";
import { ProductCard } from "@/components/product";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Елегантност и стил във всеки детайл
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Гипсови изделия за дом и индустрия – съвършенство в детайла, майсторство в изработката.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
              >
                Поръчай сега
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition font-semibold"
              >
                Контакти
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              За нас
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Като специализирани във производството на декоративни гипсови изделия, ние ArtBuildShop предлагаме функционални решения за дома и офиса.
              Имайки дългогодишен опит във производството и внимание към детайла, ние предлагаме решения съчетаващи издръжливост, функционалност и изключителна естетика.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Нашите продукти
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link
              href="/products"
              className="bg-gradient-to-br animate-gradient transition-all from-amber-300 via-amber-500 to-amber-700 rounded-xl p-8 shadow-lg hover:shadow-xl text-white"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-lg mb-6">
                <Grid3x3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Всички продукти
              </h3>
              <p className="text-white/90 mb-4">
                Разгледайте пълната ни колекция от гипсови изделия и намерете перфектното решение
              </p>
              <div className="flex items-center font-semibold">
                Виж всичко <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>

            <Link
              href="/products/decorative"
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-lg mb-6">
                <Package className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition">
                Декоративни изделия
              </h3>
              <p className="text-gray-600 mb-4">
                Гипсови орнаменти, розетки, корнизи, колони, капители, рамки и 3D панели
              </p>
              <div className="flex items-center text-amber-600 font-semibold">
                Разгледай <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>

            <Link
              href="/products/construction"
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-6">
                <Building2 className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition">
                Строителни изделия
              </h3>
              <p className="text-gray-600 mb-4">
                Гипсови елементи за стени и тавани, профили, плочи и компоненти за реставрация
              </p>
              <div className="flex items-center text-amber-600 font-semibold">
                Разгледай <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Популярни продукти
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
              >
                Виж всички продукти
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Отзиви от клиенти
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Иван Петров",
                text: "Отлично качество и прецизност. Гипсовите корнизи добавиха елегантност към нашата нова къща.",
                rating: 5,
              },
              {
                name: "Мария Георгиева",
                text: "Професионално обслужване и красиви продукти. Препоръчвам топло!",
                rating: 5,
              },
              {
                name: "Стоян Димитров",
                text: "Използвахме техните изделия за реставрация на исторична сграда. Перфектни!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готови за вашия проект?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Свържете се с нас за консултация и индивидуална оферта
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Свържи се с нас
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
