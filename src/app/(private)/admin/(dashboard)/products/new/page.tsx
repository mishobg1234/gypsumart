import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageHeader
        title="Нов продукт"
        description="Създайте нов продукт в магазина"
      />
      <ProductForm categories={categories} />
    </div>
  );
}
