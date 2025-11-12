import { getCategories } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function NewCategoryPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageHeader
        title="Нова категория"
        description="Създайте нова категория за продукти"
      />
      <CategoryForm categories={categories} />
    </div>
  );
}
