import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ArtBuildShop - Гипсови изделия за дом и индустрия",
  description: "Елегантност и стил във всеки детайл – гипсови изделия за декорация и строителна промишленост",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" suppressHydrationWarning={true}>
      <body className={`${montserrat.variable} font-montserrat bg-white text-neutral-dark`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
