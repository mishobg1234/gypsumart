import { notFound, redirect } from "next/navigation";
import { getUserById } from "@/actions/users";
import { auth } from "@/auth";
import { PageHeader, Breadcrumb } from "@/components/admin";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  // Only allow users to change their own password
  if (session?.user?.id !== id) {
    redirect("/admin/users");
  }

  return (
    <div>
      <Breadcrumb customLabel="Смяна на парола" />
      <PageHeader
        title="Смяна на парола"
        description="Променете паролата на вашия акаунт"
      />
      <ChangePasswordForm userId={user.id} />
    </div>
  );
}
