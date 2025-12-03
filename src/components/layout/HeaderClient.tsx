"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface HeaderClientProps {
  navbarPages: Array<{ slug: string; title: string }>;
}

export function HeaderClient({ navbarPages }: HeaderClientProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Затваря dropdown при клик извън него
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  return (
    <div className="py-3">
      <div className="flex items-center gap-4 md:gap-8">
        {/* ПРОДУКТИ бутон - винаги в ляво */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-green-600 text-white px-4 md:px-6 py-2 rounded hover:bg-green-700 transition inline-flex items-center gap-2 font-medium text-sm md:text-base"
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
            ПРОДУКТИ
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10 opacity-0 scale-95 animate-dropdown">
              <div className="py-2">
                <Link
                  href="/products"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-600 font-medium transition-colors"
                >
                  Всички продукти
                </Link>
                <Link
                  href="/products/decorative"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                >
                  Декоративни изделия
                </Link>
                <Link
                  href="/products/construction"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                >
                  Строителни изделия
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* МОБИЛНО МЕНЮ - дясно */}
        <div className="relative md:hidden ml-auto" ref={mobileMenuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition inline-flex items-center gap-2 font-medium text-sm"
          >
            МЕНЮ
            <Menu className="h-4 w-4" />
          </button>
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 opacity-0 scale-95 animate-dropdown">
              <div className="py-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-1.5 text-sm ${
                    isActive("/") && pathname === "/"
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Начало
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-1.5 text-sm ${
                    isActive("/about")
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  За нас
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-1.5 text-sm ${
                    isActive("/gallery")
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Галерия
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-1.5 text-sm ${
                    isActive("/blog")
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Блог
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-1.5 text-sm ${
                    isActive("/contact")
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Контакти
                </Link>
                {navbarPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-1.5 text-sm ${
                      isActive(`/${page.slug}`)
                        ? "bg-green-600 text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* НАВИГАЦИОННИ МЕНЮТА - само на desktop */}
        <nav className="hidden md:flex items-center justify-end space-x-4 ml-16 flex-1">
          <Link
            href="/"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/") && pathname === "/"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Начало
          </Link>
          <Link
            href="/gallery"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/gallery")
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Галерия
          </Link>
          <Link
            href="/blog"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/blog")
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Блог
          </Link>
          {navbarPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
                isActive(`/${page.slug}`)
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
