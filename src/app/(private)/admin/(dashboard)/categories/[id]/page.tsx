import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getCategories } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader, Breadcrumb } from "@/components/admin";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: params.id },
    }),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb customLabel={category.name} />
      <PageHeader
        title="Редактиране на категория"
        description={`Редактирайте ${category.name}`}
      />
      <CategoryForm category={category} categories={categories} />
    </div>
  );
}
