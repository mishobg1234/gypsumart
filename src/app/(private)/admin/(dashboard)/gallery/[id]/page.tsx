import { notFound } from "next/navigation";
import { getGalleryImageById } from "@/actions/misc";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default async function EditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getGalleryImageById(id);

  if (!image) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на изображение"
        description="Редактирайте информацията за изображението"
      />
      <GalleryForm initialData={image} />
    </div>
  );
}
