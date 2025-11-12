import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { PageForm } from "@/components/admin/PageForm";
import { PageHeader, Breadcrumb } from "@/components/admin";

export default async function EditPagePage({
  params,
}: {
  params: { id: string };
}) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
  });

  if (!page) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb customLabel={page.title} />
      <PageHeader
        title="Редактиране на страница"
        description={`Редактирайте ${page.title}`}
      />
      <PageForm page={page} />
    </div>
  );
}
