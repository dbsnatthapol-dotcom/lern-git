"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { toeicParts } from "@/lib/toeic-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Lock,
  Play,
  ChevronRight,
  Lightbulb,
  X,
} from "lucide-react";

const partProgress: Record<number, number> = {
  1: 80, 2: 65, 3: 55, 4: 50, 5: 75, 6: 60, 7: 45,
};

export default function AcademyPage() {
  const { t, language } = useLanguage();
  const [selectedPart, setSelectedPart] = useState<number | null>(null);

  const part = selectedPart !== null ? toeicParts[selectedPart - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t.academy.title}</h1>
        <p className="text-blue-100 mt-1">{t.academy.subtitle}</p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span>{language === "th" ? "เสร็จแล้ว" : "Completed"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full" />
            <span>{language === "th" ? "กำลังเรียน" : "In Progress"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/30 rounded-full" />
            <span>{language === "th" ? "ยังไม่เริ่ม" : "Not started"}</span>
          </div>
        </div>
      </div>

      {/* TOEIC Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {toeicParts.map((p) => {
          const prog = partProgress[p.id];
          const isDone = prog >= 90;
          const isActive = selectedPart === p.id;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPart(isActive ? null : p.id)}
              className={cn(
                "bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden",
                isActive
                  ? "border-blue-400 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-100 shadow-sm"
              )}
            >
              {/* Gradient Header */}
              <div className={cn("bg-gradient-to-r p-4 text-white", p.color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.icon}</span>
                    <div>
                      <p className="text-xs font-semibold opacity-80">
                        Part {p.id}
                      </p>
                      <p className="font-bold">
                        {language === "th" ? p.nameTH : p.name}
                      </p>
                    </div>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-white/90" />
                  ) : prog === 0 ? (
                    <Lock className="w-5 h-5 text-white/60" />
                  ) : (
                    <Badge className="bg-white/20 text-white border-0">
                      {prog}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  {language === "th" ? p.descriptionTH : p.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="bg-gray-100 rounded-full px-2 py-0.5">
                    {p.questions}{" "}
                    {language === "th" ? "ข้อ" : "questions"}
                  </span>
                </div>
                <Progress
                  value={prog}
                  barClassName={cn("bg-gradient-to-r", p.color)}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {prog}% {language === "th" ? "เสร็จ" : "complete"}
                  </span>
                  <Button size="sm" variant={isActive ? "primary" : "outline"}>
                    <Play className="w-3.5 h-3.5" />
                    {t.academy.startLesson}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part Detail Panel */}
      {part && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{part.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Part {part.id} — {language === "th" ? part.nameTH : part.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {language === "th" ? part.descriptionTH : part.description}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPart(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">
                {language === "th" ? "เทคนิคสำคัญ" : "Key Strategies"}
              </h3>
            </div>
            <ul className="space-y-2">
              {(language === "th" ? part.tipsTH : part.tips).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 mt-5">
            <Button size="lg">
              <Play className="w-5 h-5" />
              {t.academy.startLesson}
            </Button>
            <Button variant="outline" size="lg">
              {language === "th" ? "ดูบทเรียนทั้งหมด" : "View All Lessons"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
