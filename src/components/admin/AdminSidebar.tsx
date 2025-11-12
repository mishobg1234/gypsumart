"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { useEffect, useState } from "react";
import { getUnreadCounts } from "@/actions/notifications";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Image, 
  FileText, 
  MessageSquare,
  Star,
  Users,
  LogOut,
  File
} from "lucide-react";

interface UnreadCounts {
  reviews: number;
  messages: number;
  orders: number;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    reviews: 0,
    messages: 0,
    orders: 0,
  });

  useEffect(() => {
    // Зареждаме броя на непрочетените при първоначално зареждане
    async function fetchCounts() {
      const counts = await getUnreadCounts();
      setUnreadCounts(counts);
    }
    fetchCounts();

    // Опресняваме броя на всеки 30 секунди
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { href: "/admin/products", label: "Продукти", icon: Package, badge: null },
    { href: "/admin/categories", label: "Категории", icon: FolderTree, badge: null },
    { href: "/admin/orders", label: "Поръчки", icon: ShoppingCart, badge: "orders" as const },
    { href: "/admin/gallery", label: "Галерия", icon: Image, badge: null },
    { href: "/admin/blog", label: "Блог", icon: FileText, badge: null },
    { href: "/admin/pages", label: "Страници", icon: File, badge: null },
    { href: "/admin/reviews", label: "Отзиви", icon: Star, badge: "reviews" as const },
    { href: "/admin/messages", label: "Съобщения", icon: MessageSquare, badge: "messages" as const },
    { href: "/admin/users", label: "Потребители", icon: Users, badge: null },
  ];

  async function handleLogout() {
    await logout();
  }

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="block">
          <h2 className="text-2xl font-bold">
            Gypsum<span className="text-amber-600">Art</span>
          </h2>
          <p className="text-gray-400 text-sm">Админ панел</p>
        </Link>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const badgeCount = item.badge ? unreadCounts[item.badge] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Изход</span>
        </button>
      </div>
    </aside>
  );
}
