import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [] });
    }

    const searchTerm = query.trim();

    // Търси продукти по име, описание и категория
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            shortDescription: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 10, // Ограничаваме до 10 резултата
      orderBy: {
        createdAt: "desc",
      },
    });

    // Форматираме резултатите
    const formattedProducts = products.map((product) => {
      const images = product.images ? JSON.parse(product.images) as string[] : [];
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images.length > 0 ? images[0] : null,
        categoryName: product.category?.name || null,
        categorySlug: product.category?.slug || null,
        shortDescription: product.shortDescription,
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Грешка при търсене на продукти" },
      { status: 500 }
    );
  }
}
