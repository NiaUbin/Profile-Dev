import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nattawat_DEV | Full Stack Developer Portfolio",
  description: "พอร์ตโฟลิโอของ Nattawat - Full Stack Developer ผู้เชี่ยวชาญ React, Next.js, Node.js และการสร้างระบบ Full Stack ที่สมบูรณ์",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "TypeScript", "Portfolio", "Thailand"],
  authors: [{ name: "Nattawat" }],
  openGraph: {
    title: "Nattawat_DEV | Full Stack Developer Portfolio",
    description: "พอร์ตโฟลิโอของ Nattawat - Full Stack Developer ผู้เชี่ยวชาญ React, Next.js, Node.js",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
        <div className="scanlines"></div>
      </body>
    </html>
  );
}
