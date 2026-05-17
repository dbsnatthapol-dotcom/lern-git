"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Bell, Search, User } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const pageTitles: Record<string, { key: string; titleKey: keyof any }> = {
  "/": { key: "dashboard", titleKey: "title" },
  "/academy": { key: "academy", titleKey: "title" },
  "/vocabulary": { key: "vocabulary", titleKey: "title" },
  "/grammar": { key: "grammar", titleKey: "title" },
  "/test": { key: "testing", titleKey: "title" },
  "/ai-tutor": { key: "aiTutor", titleKey: "title" },
  "/vault": { key: "vault", titleKey: "title" },
};

export function Topbar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const page = pageTitles[pathname];

  const getTitle = () => {
    if (!page) return "ADAM TOEIC APP";
    const mod = t[page.key as keyof typeof t] as AnyRecord;
    return mod?.title || "ADAM TOEIC APP";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
      <h1 className="text-lg font-bold text-gray-900 flex-1">{getTitle()}</h1>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={language === "th" ? "ค้นหา..." : "Search..."}
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center cursor-pointer">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}
