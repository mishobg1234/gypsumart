import { getBannerById } from "@/actions/banners";
import { BannerForm } from "@/components/admin/BannerForm";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { notFound } from "next/navigation";

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const banner = await getBannerById(id);

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb customLabel={banner.title || "Редактирай банер"} />

      <h1 className="text-3xl font-bold text-gray-900">Редактирай банер</h1>

      <BannerForm banner={banner as any} />
    </div>
  );
}
