import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";

export const metadata: Metadata = {
  title: "酒メモ - Sake Tracker",
  description: "飲んだ日本酒を記録・アーカイブするアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased pb-16">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
