"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toeicParts } from "@/lib/toeic-data";
import {
  Flame,
  BookOpen,
  ClipboardList,
  Target,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";

const userStats = {
  currentScore: 650,
  targetScore: 990,
  streak: 14,
  wordsLearned: 847,
  testsCompleted: 23,
  accuracy: 78,
  todayMinutes: 45,
};

const recentActivities = [
  { icon: "📝", text: "Part 5 Practice — 20 questions", score: "85%", time: "2h ago" },
  { icon: "📚", text: "Vocabulary: Business Terms", score: "+15 words", time: "5h ago" },
  { icon: "🎙️", text: "Part 3 Listening Practice", score: "72%", time: "Yesterday" },
  { icon: "🤖", text: "AI Tutor: Passive Voice Review", score: null, time: "Yesterday" },
];

const studyPlan = [
  { task: "Vocabulary review (20 words)", done: true },
  { task: "Part 5 Grammar — 15 questions", done: true },
  { task: "Part 7 Reading passage", done: false },
  { task: "AI Tutor feedback session", done: false },
];

const partProgress = [
  { part: 1, progress: 80 },
  { part: 2, progress: 65 },
  { part: 3, progress: 55 },
  { part: 4, progress: 50 },
  { part: 5, progress: 75 },
  { part: 6, progress: 60 },
  { part: 7, progress: 45 },
];

export default function Dashboard() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">
            {t.dashboard.welcome}, Adam! 👋
          </p>
          <h2 className="text-2xl font-bold mt-1">
            {language === "th"
              ? `คุณเหลืออีก ${userStats.targetScore - userStats.currentScore} คะแนนสู่ 990!`
              : `${userStats.targetScore - userStats.currentScore} points to your goal of 990!`}
          </h2>
          <p className="text-blue-200 text-sm mt-1">
            {language === "th"
              ? `เรียนวันนี้แล้ว ${userStats.todayMinutes} นาที — ยอดเยี่ยม!`
              : `You've studied ${userStats.todayMinutes} minutes today — great job!`}
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link href="/academy">
              <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
                {t.dashboard.continueStudy} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ai-tutor">
              <Button
                size="sm"
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
              >
                <Bot className="w-4 h-4" />
                {t.dashboard.askAI}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <ScoreGauge
          current={userStats.currentScore}
          target={userStats.targetScore}
          label={t.dashboard.currentScore}
          sublabel={`${t.dashboard.targetScore}: ${userStats.targetScore}`}
        />

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatsCard
            title={t.dashboard.studyStreak}
            value={`${userStats.streak}`}
            subtitle={t.dashboard.days}
            icon={Flame}
            gradient="bg-gradient-to-br from-orange-400 to-red-500"
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title={t.dashboard.wordsLearned}
            value={userStats.wordsLearned.toLocaleString()}
            subtitle={language === "th" ? "คำศัพท์" : "words total"}
            icon={BookOpen}
            gradient="bg-gradient-to-br from-blue-400 to-indigo-500"
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title={t.dashboard.testsCompleted}
            value={userStats.testsCompleted}
            subtitle={language === "th" ? "ชุดข้อสอบ" : "mock tests"}
            icon={ClipboardList}
            gradient="bg-gradient-to-br from-green-400 to-teal-500"
          />
          <StatsCard
            title={t.dashboard.accuracy}
            value={`${userStats.accuracy}%`}
            subtitle={language === "th" ? "ความแม่นยำ" : "overall accuracy"}
            icon={Target}
            gradient="bg-gradient-to-br from-purple-400 to-pink-500"
            trend={{ value: 3, positive: true }}
          />
          <StatsCard
            title={language === "th" ? "เวลาเรียนวันนี้" : "Today Study"}
            value={`${userStats.todayMinutes}m`}
            subtitle={language === "th" ? "นาที" : "minutes"}
            icon={Clock}
            gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
          />
          <StatsCard
            title={language === "th" ? "พัฒนาการ" : "Improvement"}
            value="+120"
            subtitle={language === "th" ? "คะแนนในเดือนนี้" : "pts this month"}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
            trend={{ value: 18, positive: true }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Part Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">
              {language === "th" ? "ความก้าวหน้าแต่ละ Part" : "Progress by Part"}
            </h3>
            <Link href="/academy" className="text-xs text-blue-600 font-medium hover:underline">
              {language === "th" ? "ดูทั้งหมด" : "View all"} →
            </Link>
          </div>
          <div className="space-y-3">
            {partProgress.map(({ part, progress }) => {
              const partData = toeicParts[part - 1];
              return (
                <div key={part} className="flex items-center gap-3">
                  <span className="text-lg w-6">{partData.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">
                        Part {part}
                        {language === "th" ? ` — ${partData.nameTH}` : ` — ${partData.name}`}
                      </span>
                      <span className="font-bold text-gray-900">{progress}%</span>
                    </div>
                    <Progress
                      value={progress}
                      barClassName={`bg-gradient-to-r ${partData.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Today's Study Plan */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                {language === "th" ? "แผนการเรียนวันนี้" : "Today's Study Plan"}
              </h3>
              <span className="text-xs text-gray-500">
                {studyPlan.filter((s) => s.done).length}/{studyPlan.length}
              </span>
            </div>
            <div className="space-y-2">
              {studyPlan.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 ${item.done ? "text-green-500" : "text-gray-200"}`}
                  />
                  <span
                    className={`text-sm ${item.done ? "text-gray-400 line-through" : "text-gray-700"}`}
                  >
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              {t.dashboard.recentActivity}
            </h3>
            <div className="space-y-3">
              {recentActivities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{a.text}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.score && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {a.score}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold">
            {language === "th" ? "เริ่มได้เลย" : "Quick Start"}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/test", label: language === "th" ? "ทำข้อสอบ Part 5" : "Part 5 Practice", icon: "✏️" },
            { href: "/vocabulary", label: language === "th" ? "เรียนคำศัพท์" : "Flashcards", icon: "📚" },
            { href: "/ai-tutor", label: language === "th" ? "ถาม AI Tutor" : "Ask AI Tutor", icon: "🤖" },
            { href: "/academy", label: language === "th" ? "บทเรียน Part 7" : "Part 7 Lesson", icon: "📖" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-sm font-medium transition-all"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
