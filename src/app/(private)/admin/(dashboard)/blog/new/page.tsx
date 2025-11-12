import { BlogForm } from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="Нова публикация"
        description="Създайте нова блог публикация"
      />
      <BlogForm />
    </div>
  );
}
