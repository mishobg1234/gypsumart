"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AreaCalculator } from "./AreaCalculator";

export function TopNavLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="hidden md:flex items-center space-x-4 ml-auto">
      {/* Area Calculator - Desktop only */}
      <AreaCalculator />
      
      {/* 
        РАЗМЕР НА БУТОНИТЕ - Промени тук:
        - px-X (padding horizontal) - ширина: px-2, px-3, px-4, px-5, px-6 (текущо px-4)
        - py-X (padding vertical) - височина: py-1, py-1.5, py-2 (текущо py-1.5)
        - text-X (font size) - размер на текста: text-xs, text-sm, text-base (текущо text-sm)
      */}
      <Link
        href="/about"
        className={`px-4 py-2 text-sm rounded transition font-medium whitespace-nowrap ${
          isActive("/about")
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        За нас
      </Link>
      <Link
        href="/contact"
        className={`px-4 py-2 text-sm rounded transition font-medium whitespace-nowrap ${
          isActive("/contact")
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Контакти
      </Link>
    </div>
  );
}
