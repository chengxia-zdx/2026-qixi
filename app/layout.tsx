import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const previewImage = `${protocol}://${host}/og.png`;

  return {
    title: "春天住进星星里 | 写给春春的七夕情书",
    description:
      "春春和星星的故事，从 2024 年 4 月 14 日开始，继续写向更远的未来。",
    openGraph: {
      title: "春天住进星星里",
      description: "写给春春的一封七夕情书",
      type: "website",
      locale: "zh_CN",
      images: [{ url: previewImage, width: 1200, height: 628, alt: "春天住进星星里" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "春天住进星星里",
      description: "写给春春的一封七夕情书",
      images: [previewImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
