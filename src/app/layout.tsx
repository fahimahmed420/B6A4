import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthInit from "@/components/AuthInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediStore - Your Trusted Online Medicine Shop",
  description: "Buy OTC medicines online with ease. Fast delivery, genuine products, trusted sellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <AuthInit />
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
