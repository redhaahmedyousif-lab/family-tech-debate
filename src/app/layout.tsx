import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "التكنولوجيا والتواصل الأسري — إعداد رضا أحمد يوسف",
  description:
    "منصّة تفاعليّة تحليليّة تُناقش أثر التقنية على الروابط الأسرية بين عراقة الماضي وواقع العصر الرقمي — مادة اللغة العربية والأدب (IB MYP).",
};

export const viewport: Viewport = {
  themeColor: "#140d08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
