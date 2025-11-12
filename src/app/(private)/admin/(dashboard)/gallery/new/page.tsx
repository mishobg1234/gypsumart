import { GalleryForm } from "@/components/admin/GalleryForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewGalleryImagePage() {
  return (
    <div>
      <PageHeader
        title="Ново изображение"
        description="Добавете ново изображение в галерията"
      />
      <GalleryForm />
    </div>
  );
}
