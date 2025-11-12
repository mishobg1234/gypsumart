import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  customLabel?: string;
}

export function Breadcrumb({ customLabel }: BreadcrumbProps) {
  if (typeof window === "undefined") return null;
  
  const pathname = window.location.pathname;
  
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  
  // Remove "admin" from segments
  const breadcrumbSegments = segments.filter((segment) => segment !== "admin");

  const breadcrumbMap: Record<string, string> = {
    dashboard: "Dashboard",
    products: "Продукти",
    categories: "Категории",
    orders: "Поръчки",
    gallery: "Галерия",
    blog: "Блог",
    pages: "Страници",
    reviews: "Отзиви",
    messages: "Съобщения",
    users: "Потребители",
    new: "Нов",
    edit: "Редакция",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link
        href="/admin/dashboard"
        className="flex items-center hover:text-amber-600 transition"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;
        const href = `/admin/${breadcrumbSegments.slice(0, index + 1).join("/")}`;
        
        // Use custom label for the last segment if provided
        let label = breadcrumbMap[segment] || segment;
        if (isLast && customLabel) {
          label = customLabel;
        }

        return (
          <div key={`${segment}-${index}`} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{label}</span>
            ) : (
              <Link href={href} className="hover:text-amber-600 transition">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
