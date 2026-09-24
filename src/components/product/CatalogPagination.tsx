import Link from "next/link";

export function CatalogPagination({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Страници с продукти" className="mt-10 flex items-center justify-center gap-4">
      {page > 1 && (
        <Link href={href(page - 1)} className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          ← Предишна
        </Link>
      )}
      <span className="text-sm text-gray-600">Страница {page} от {totalPages}</span>
      {page < totalPages && (
        <Link href={href(page + 1)} className="rounded-lg border px-4 py-2 hover:bg-gray-100">
          Следваща →
        </Link>
      )}
    </nav>
  );
}
