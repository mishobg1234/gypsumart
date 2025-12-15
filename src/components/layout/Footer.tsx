import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { getFooterPages } from "@/actions/pages";

export async function Footer() {
  const footerPages = await getFooterPages();

  return (
    <footer className="bg-neutral-dark text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-extrabold mb-4">
              <span className="text-brand-green-light">ARTBUILD</span>
              <span className="font-medium"> SHOP</span>
            </h3>
            <p className="text-sm mb-4">
              Елегантност и стил във всеки детайл – гипсови изделия за дом и индустрия
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-green-light transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-brand-green-light transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Бързи връзки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-green-600 transition">
                  За нас
                </Link>
              </li>
              
              <li>
                <Link href="/gallery" className="hover:text-green-600 transition">
                  Галерия
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-green-600 transition">
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
                <Link href="/contact" className="hover:text-green-600 transition">
                  Контакти
                </Link>
              </li>
              {footerPages.filter(page => page.slug !== 'about' && page.slug !== 'за-нас').map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-green-600 transition">
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
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>София, България</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-600" />
                <span>0877 098 540</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-600" />
                <span>info@artbuildshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ArtBuildShop. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}
