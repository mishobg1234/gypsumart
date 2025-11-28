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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="py-3">
      <div className="flex items-center gap-8">
        {/* ПРОДУКТИ бутон - винаги в ляво */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition inline-flex items-center gap-2 font-medium"
          >
            <Menu className="h-5 w-5" />
            ПРОДУКТИ
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10">
              <div className="py-2">
                <Link
                  href="/products"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600 font-medium"
                >
                  Всички продукти
                </Link>
                <Link
                  href="/products/decorative"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                >
                  Декоративни изделия
                </Link>
                <Link
                  href="/products/construction"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                >
                  Строителни изделия
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* НАВИГАЦИОННИ МЕНЮТА */}
        <nav className="hidden md:flex items-center justify-end space-x-4 ml-16 flex-1">
          <Link
            href="/"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/") && pathname === "/"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Начало
          </Link>
          <Link
            href="/gallery"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/gallery")
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Галерия
          </Link>
          <Link
            href="/blog"
            className={`px-6 py-2 rounded transition font-medium whitespace-nowrap ${
              isActive("/blog")
                ? "bg-amber-600 text-white hover:bg-amber-700"
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
                  ? "bg-amber-600 text-white hover:bg-amber-700"
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
