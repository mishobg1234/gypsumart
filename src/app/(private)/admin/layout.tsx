import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

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
