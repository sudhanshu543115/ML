import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import NavbarWrapper from "@/src/layout/NavbarWrapper";
import { Footer } from "@/src/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MutualLearn",
  description: "Skill exchange platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {/* ✅ CLIENT WRAPPER */}
        <NavbarWrapper />

        {children}

        <Footer />
      </body>
    </html>
  );
}
