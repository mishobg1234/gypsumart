import { notFound } from "next/navigation";
import { getUserById } from "@/actions/users";
import { PageHeader, Breadcrumb } from "@/components/admin";
import { UserForm } from "@/components/admin/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb customLabel={user.name || user.email} />
      <PageHeader
        title="Редактиране на потребител"
        description={`Редактирайте ${user.name || user.email}`}
      />
      <UserForm user={user} />
    </div>
  );
}
