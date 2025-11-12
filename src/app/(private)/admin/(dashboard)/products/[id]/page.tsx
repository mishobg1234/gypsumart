import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader, Breadcrumb } from "@/components/admin";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paramsId } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: paramsId },
      include: { category: true },
    }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb customLabel={product.name} />
      <PageHeader
        title="Редактиране на продукт"
        description={`Редактирайте ${product.name}`}
      />
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
