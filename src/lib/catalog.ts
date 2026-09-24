import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";

export const PAGE_SIZE = 24;

export const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  images: true,
  inStock: true,
  category: { select: { name: true } },
  reviews: { where: { approved: true }, select: { rating: true } },
  _count: { select: { reviews: { where: { approved: true } } } },
} satisfies Prisma.ProductSelect;

export function parseCatalogPage(value: string | string[] | undefined) {
  const page = typeof value === "string" ? Number(value) : 1;
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export async function getCatalogPage(where: Prisma.ProductWhereInput, page: number) {
  const [products, count] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, count, totalPages: Math.ceil(count / PAGE_SIZE) };
}
