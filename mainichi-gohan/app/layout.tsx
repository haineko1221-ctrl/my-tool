import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "まいにちごはん",
  description: "料理の写真を送るだけで、AIが食事内容を分析。毎日の食事を気にかけるきっかけを作るシステム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
