import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader, Breadcrumb } from "@/components/admin";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  return (
    <div>
      <Breadcrumb customLabel="Смяна на парола" />
      <PageHeader
        title="Смяна на парола"
        description="Променете паролата на вашия акаунт"
      />
      <ChangePasswordForm userId={session.user.id} />
    </div>
  );
}
