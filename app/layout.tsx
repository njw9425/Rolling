import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "롤링스톤즈 | 볼링 성장 경쟁 플랫폼",
  description: "롤링스톤즈 볼링 동아리를 위한 기록, 성장, 랭킹 플랫폼"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
