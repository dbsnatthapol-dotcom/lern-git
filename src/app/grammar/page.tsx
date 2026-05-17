"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { grammarTopics } from "@/lib/toeic-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen, Trophy, X } from "lucide-react";

const grammarDetails: Record<string, { rules: string[]; rulesTH: string[]; examples: { en: string; th: string }[] }> = {
  tenses: {
    rules: [
      "Simple Present: subject + V1 (habitual actions, facts)",
      "Simple Past: subject + V2 (completed actions)",
      "Present Perfect: subject + have/has + V3 (past with present relevance)",
      "Past Perfect: subject + had + V3 (completed before another past action)",
      "Future Simple: subject + will + V1 (predictions, decisions)",
    ],
    rulesTH: [
      "Simple Present: S + V1 (กิจวัตร, ความจริง)",
      "Simple Past: S + V2 (เหตุการณ์ที่เสร็จสิ้นแล้ว)",
      "Present Perfect: S + have/has + V3 (อดีตที่มีผลถึงปัจจุบัน)",
      "Past Perfect: S + had + V3 (เสร็จก่อนอีกเหตุการณ์ในอดีต)",
      "Future Simple: S + will + V1 (การคาดการณ์, การตัดสินใจ)",
    ],
    examples: [
      { en: "The company releases reports quarterly.", th: "บริษัทเผยแพร่รายงานทุกไตรมาส" },
      { en: "She submitted the proposal yesterday.", th: "เธอส่งข้อเสนอเมื่อวาน" },
      { en: "We have already reviewed the contract.", th: "เราได้ตรวจสอบสัญญาแล้ว" },
      { en: "By the time he arrived, the meeting had ended.", th: "เมื่อเขามาถึง การประชุมจบไปแล้ว" },
    ],
  },
  passive: {
    rules: [
      "Present Passive: is/am/are + past participle",
      "Past Passive: was/were + past participle",
      "Future Passive: will be + past participle",
      "Modal Passive: modal + be + past participle",
      "Perfect Passive: have/has been + past participle",
    ],
    rulesTH: [
      "Present Passive: is/am/are + V3",
      "Past Passive: was/were + V3",
      "Future Passive: will be + V3",
      "Modal Passive: modal + be + V3 (must be reviewed)",
      "Perfect Passive: have/has been + V3",
    ],
    examples: [
      { en: "The report is written by the manager.", th: "รายงานถูกเขียนโดยผู้จัดการ" },
      { en: "The contract was signed last week.", th: "สัญญาถูกลงนามสัปดาห์ที่แล้ว" },
      { en: "The project will be completed by December.", th: "โครงการจะเสร็จสิ้นภายในเดือนธันวาคม" },
    ],
  },
  conditionals: {
    rules: [
      "Zero Conditional: If + present, present (facts/habits)",
      "First Conditional: If + present, will + V1 (real possibility)",
      "Second Conditional: If + past, would + V1 (unreal/hypothetical)",
      "Third Conditional: If + past perfect, would have + V3 (past unreal)",
    ],
    rulesTH: [
      "Zero: If + present, present (ความจริงทั่วไป)",
      "First: If + present, will + V1 (สถานการณ์ที่เป็นไปได้)",
      "Second: If + past, would + V1 (สมมติ/ไม่จริง)",
      "Third: If + past perfect, would have + V3 (สมมติในอดีต)",
    ],
    examples: [
      { en: "If you heat water to 100°C, it boils.", th: "ถ้าคุณต้มน้ำที่ 100°C น้ำจะเดือด" },
      { en: "If we win the contract, we will hire more staff.", th: "ถ้าเราได้สัญญา เราจะจ้างพนักงานเพิ่ม" },
      { en: "If I were the CEO, I would expand globally.", th: "ถ้าฉันเป็น CEO ฉันจะขยายกิจการไปทั่วโลก" },
    ],
  },
};

export default function GrammarPage() {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  const detail = selected ? grammarDetails[selected] : null;
  const topic = selected ? grammarTopics.find((g) => g.id === selected) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t.grammar.title}</h1>
        <p className="text-purple-100 mt-1">{t.grammar.subtitle}</p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {grammarTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => setSelected(selected === topic.id ? null : topic.id)}
            className={cn(
              "bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden",
              selected === topic.id
                ? "border-purple-400 shadow-lg ring-2 ring-purple-200"
                : "border-gray-100 shadow-sm"
            )}
          >
            <div className={cn("bg-gradient-to-r p-4 text-white", topic.color)}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <p className="font-bold text-lg">
                    {language === "th" ? topic.nameTH : topic.name}
                  </p>
                  <p className="text-sm opacity-80">
                    {language === "th" ? topic.descriptionTH : topic.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {topic.subtopics} {language === "th" ? "หัวข้อย่อย" : "subtopics"}
                </span>
              </div>
              <Badge
                variant={
                  topic.importance === "very high"
                    ? "danger"
                    : topic.importance === "high"
                    ? "warning"
                    : "info"
                }
              >
                {topic.importance === "very high"
                  ? language === "th" ? "สำคัญมาก" : "Very High"
                  : topic.importance === "high"
                  ? language === "th" ? "สำคัญ" : "High"
                  : language === "th" ? "ปานกลาง" : "Medium"}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {detail && topic && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{topic.icon}</span>
              <h2 className="text-xl font-bold text-gray-900">
                {language === "th" ? topic.nameTH : topic.name}
              </h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rules */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {language === "th" ? "กฎสำคัญ" : "Key Rules"}
              </h3>
              <ul className="space-y-2">
                {(language === "th" ? detail.rulesTH : detail.rules).map((rule, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-500" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                {language === "th" ? "ตัวอย่าง" : "Examples"}
              </h3>
              <div className="space-y-3">
                {detail.examples.map((ex, i) => (
                  <div key={i} className="bg-blue-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-blue-900 italic">&ldquo;{ex.en}&rdquo;</p>
                    <p className="text-xs text-blue-600 mt-1">{ex.th}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button>
              {language === "th" ? "เริ่มฝึกทำข้อสอบ" : "Start Practice"}
            </Button>
            <Button variant="outline">
              {language === "th" ? "เรียนบทเรียนเต็ม" : "Full Lesson"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
