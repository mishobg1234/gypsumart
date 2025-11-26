import Link from "next/link";
import { Menu } from "lucide-react";
import { getNavbarPages } from "@/actions/pages";
import { CartIcon } from "./CartIcon";

export async function Header() {
  const navbarPages = await getNavbarPages();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="text-amber-600">Art</span>BuildShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition">
              Начало
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-amber-600 transition">
                Продукти
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600 font-medium"
                  >
                    Всички продукти
                  </Link>
                  <Link
                    href="/products/decorative"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                  >
                    Декоративни изделия
                  </Link>
                  <Link
                    href="/products/construction"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                  >
                    Строителни изделия
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition">
              За нас
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-amber-600 transition">
              Галерия
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-amber-600 transition">
              Блог
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition">
              Контакти
            </Link>
            {navbarPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            <button className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
