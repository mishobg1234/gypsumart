import Link from "next/link";
import { getNavbarPages } from "@/actions/pages";
import { CartIcon } from "./CartIcon";
import { HeaderClient } from "./HeaderClient";
import { TopNavLinks } from "./TopNavLinks";
import { SearchBar } from "./SearchBar";
import { AreaCalculator } from "./AreaCalculator";

export async function Header() {
  const navbarPages = await getNavbarPages();

  return (
    <header className="border-b bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">ARTBUILD</span>
            <span className="text-xl font-medium text-gray-700">SHOP</span>
          </Link>
          
          {/* 
            ТЪРСАЧКА - Регулирай позицията тук:
            
            1. ХОРИЗОНТАЛНО ПОЗИЦИОНИРАНЕ:
               - mx-auto = центрирана (текущо)
               - ml-auto = най-вдясно
               - mr-auto = най-вляво
               - ml-X = отместване от ляво (ml-0, ml-4, ml-8, ml-16, ml-24, ml-32)
               - mr-X = отместване от дясно (mr-0, mr-4, mr-8, mr-16, mr-24)
            
            2. ШИРИНА:
               - max-w-xs = много малка (320px)
               - max-w-sm = малка (384px)
               - max-w-md = средна (448px) - текущо
               - max-w-lg = голяма (512px)
               - max-w-xl = много голяма (576px)
               - max-w-2xl = огромна (672px)
            
            3. ОТСТОЯНИЯ ОТ КРАИЩАТА:
               - px-X = padding horizontal (px-0, px-4, px-8, px-12)
          */}
          <div className="absolute left-1/2 transform -translate-x-1/2 max-w-lg hidden md:block">
            <SearchBar />
          </div>
          
          {/* Top Navigation Links - За нас и Контакти */}
          <TopNavLinks />
          
          {/* Icons */}
          <div className="flex items-center space-x-4 ml-4">
            {/* Area Calculator - Mobile only */}
            <div className="md:hidden">
              <AreaCalculator />
            </div>
            <CartIcon />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3 border-b border-gray-200">
          <SearchBar isMobile />
        </div>

        {/* Navigation Bar - Client Component */}
        <HeaderClient navbarPages={navbarPages} />
      </div>
    </header>
  );
}
