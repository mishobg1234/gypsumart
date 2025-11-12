import { PageForm } from "@/components/admin/PageForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewPagePage() {
  return (
    <div>
      <PageHeader
        title="Нова страница"
        description="Създайте нова статична страница"
      />
      <PageForm />
    </div>
  );
}
