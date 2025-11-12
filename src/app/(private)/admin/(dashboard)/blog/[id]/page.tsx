import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { BlogForm } from "@/components/admin/BlogForm";
import { PageHeader, Breadcrumb } from "@/components/admin";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb customLabel={post.title} />
      <PageHeader
        title="Редактиране на публикация"
        description={`Редактирайте ${post.title}`}
      />
      <BlogForm post={post} />
    </div>
  );
}
