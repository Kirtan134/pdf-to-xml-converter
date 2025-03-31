import Header from "@/components/Header";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF to XML Converter",
  description: "Convert your PDFs to XML while preserving document structure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-8 px-4">{children}</main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
