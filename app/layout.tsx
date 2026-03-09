import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nattawat | Full Stack Developer Portfolio",
  description: "Nattawat Full Stack Developer portfolio — React, Next.js, Node.js, TypeScript developer based in Thailand. พอร์ตโฟลิโอของ Nattawat ผู้เชี่ยวชาญการสร้างระบบ Full Stack ที่สมบูรณ์",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "TypeScript", "Portfolio", "Thailand", "Developer", "Web Developer"],
  authors: [{ name: "Nattawat" }],
  openGraph: {
    title: "Nattawat | Full Stack Developer Portfolio",
    description: "Nattawat Full Stack Developer portfolio — React, Next.js, Node.js, TypeScript developer. พอร์ตโฟลิโอของ Nattawat",
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
