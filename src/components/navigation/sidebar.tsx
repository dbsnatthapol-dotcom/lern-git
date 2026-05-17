"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PenTool,
  ClipboardList,
  Bot,
  FolderOpen,
  Globe,
  Trophy,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, key: "dashboard" },
  { href: "/academy", icon: GraduationCap, key: "academy" },
  { href: "/vocabulary", icon: BookOpen, key: "vocabulary" },
  { href: "/grammar", icon: PenTool, key: "grammar" },
  { href: "/test", icon: ClipboardList, key: "testing" },
  { href: "/ai-tutor", icon: Bot, key: "aiTutor" },
  { href: "/vault", icon: FolderOpen, key: "vault" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">
              {t.appName}
            </p>
            <p className="text-xs text-blue-400 font-semibold">{t.appSubtitle}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{t.appTagline}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = t.nav[item.key as keyof typeof t.nav];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
              {item.key === "aiTutor" && (
                <span className="ml-auto text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="p-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 mb-2 px-1">{t.common.language}</p>
        <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setLanguage("th")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
              language === "th"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            ไทย
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
              language === "en"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            EN
          </button>
        </div>
      </div>
    </aside>
  );
}
