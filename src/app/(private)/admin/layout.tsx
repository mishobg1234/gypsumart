import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "GypsumArt Admin",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const headersList = await headers();
    const path = headersList.get("x-pathname") || "/";

    if (!session && path !== "/admin/login") {
        redirect("/admin/login");
    }

    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    if (session?.user && path === "/admin/login") {
        redirect("/admin/dashboard");
    }

    return (
        <html lang="bg">
            <body className={inter.className}>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">{children}</main>
                </div>
            </body>
        </html>
    );
}
