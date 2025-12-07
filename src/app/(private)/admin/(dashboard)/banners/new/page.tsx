import { BannerForm } from "@/components/admin/BannerForm";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb customLabel="Нов банер" />

      <h1 className="text-3xl font-bold text-gray-900">Нов банер</h1>

      <BannerForm />
    </div>
  );
}
