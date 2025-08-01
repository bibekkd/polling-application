import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-Time Polling App",
  description: "Interactive polling application for teachers and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <div className="min-h-screen bg-[#F2F2F2]">
          {children}
        </div>
      </body>
    </html>
  );
}
