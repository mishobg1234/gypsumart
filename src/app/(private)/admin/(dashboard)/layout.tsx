import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log("🔐 Admin Dashboard Layout - Session:", {
    hasSession: !!session,
    userEmail: session?.user?.email,
    userRole: session?.user?.role,
    isAdmin: session?.user?.role === "ADMIN"
  });

  if (!session || session.user.role !== "ADMIN") {
    console.log("❌ Redirecting to login - not admin");
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
