import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ADAM TOEIC APP — 990 SCORE",
  description:
    "AI-Powered TOEIC Learning Platform. Master TOEIC with Claude AI. Target: 990.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-gray-50">
        <LanguageProvider>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 min-h-full">
              <Topbar />
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
