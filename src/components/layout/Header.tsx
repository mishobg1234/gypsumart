import Link from "next/link";
import { Search } from "lucide-react";
import { getNavbarPages } from "@/actions/pages";
import { CartIcon } from "./CartIcon";
import { HeaderClient } from "./HeaderClient";
import { TopNavLinks } from "./TopNavLinks";

export async function Header() {
  const navbarPages = await getNavbarPages();

  return (
    <header className="border-b bg-white md:sticky md:top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex items-center justify-between py-4 border-b">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="text-amber-600">Art</span>BuildShop
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
            <div className="relative">
              <input
                type="text"
                placeholder="Търсене на продукти..."
                className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Top Navigation Links - За нас и Контакти */}
          <TopNavLinks />
          
          {/* Icons */}
          <div className="flex items-center space-x-4 ml-4">
            <CartIcon />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Търсене на продукти..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Navigation Bar - Client Component */}
        <HeaderClient navbarPages={navbarPages} />
      </div>
    </header>
  );
}
