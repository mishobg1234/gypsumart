import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { getFooterPages } from "@/actions/pages";

export async function Footer() {
  const footerPages = await getFooterPages();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              Gypsum<span className="text-amber-600">Art</span>
            </h3>
            <p className="text-sm mb-4">
              Елегантност и стил във всеки детайл – гипсови изделия за дом и индустрия
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-600 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-amber-600 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Бързи връзки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition">
                  За нас
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-600 transition">
                  Магазин
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-600 transition">
                  Галерия
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-600 transition">
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition">
                  За нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 transition">
                  Контакти
                </Link>
              </li>
              {footerPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-amber-600 transition">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакти</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span>София, България</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-amber-600" />
                <span>+359 888 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-amber-600" />
                <span>info@gypsumart.bg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} GypsumArt. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}
