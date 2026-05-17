"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { mockTestQuestions } from "@/lib/toeic-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

type TestMode = "select" | "running" | "result";

const testModes = [
  { id: "mini", labelTH: "Mini Test (5 ข้อ)", labelEN: "Mini Test (5 Q)", questions: 5, time: 10 },
  { id: "part5", labelTH: "Part 5 — 20 ข้อ", labelEN: "Part 5 — 20 Q", questions: 5, time: 20 },
  { id: "full", labelTH: "Full Mock Test", labelEN: "Full Mock Test", questions: 5, time: 120 },
];

export default function TestPage() {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<TestMode>("select");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = mockTestQuestions;
  const q = questions[current];

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [current]: optionIndex }));
  };

  const handleSubmit = () => setMode("result");

  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correct
  ).length;
  const score = Math.round((correctCount / questions.length) * 990);
  const pct = (correctCount / questions.length) * 100;

  const reset = () => {
    setMode("select");
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
  };

  if (mode === "select") {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">{t.testing.title}</h1>
          <p className="text-green-100 mt-1">{t.testing.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testModes.map((tm) => (
            <div
              key={tm.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setMode("running")}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                {language === "th" ? tm.labelTH : tm.labelEN}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <ClipboardList className="w-3.5 h-3.5" />
                  {tm.questions} {language === "th" ? "ข้อ" : "questions"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {tm.time} {language === "th" ? "นาที" : "min"}
                </span>
              </div>
              <Button size="sm" className="mt-4 w-full">
                <Play className="w-4 h-4" />
                {t.testing.startTest}
              </Button>
            </div>
          ))}
        </div>

        {/* Past Results */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            {language === "th" ? "ผลการทดสอบล่าสุด" : "Recent Test Results"}
          </h3>
          <div className="space-y-3">
            {[
              { date: "2026-05-16", type: "Part 5 Practice", score: "85%", correct: "17/20" },
              { date: "2026-05-14", type: "Mini Test", score: "80%", correct: "4/5" },
              { date: "2026-05-12", type: "Part 5 Practice", score: "70%", correct: "14/20" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.type}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{r.score}</p>
                  <p className="text-xs text-gray-400">{r.correct}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "result") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Result Banner */}
        <div
          className={cn(
            "rounded-2xl p-6 text-white text-center",
            pct >= 80
              ? "bg-gradient-to-r from-green-500 to-teal-600"
              : pct >= 60
              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
              : "bg-gradient-to-r from-red-500 to-pink-600"
          )}
        >
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <p className="text-5xl font-bold">{score}</p>
          <p className="text-lg font-semibold mt-1">
            {language === "th" ? "คะแนน TOEIC" : "TOEIC Score"}
          </p>
          <p className="text-sm mt-1 opacity-80">
            {correctCount}/{questions.length}{" "}
            {language === "th" ? "ข้อถูก" : "correct"}
            {" — "}{Math.round(pct)}%
          </p>
        </div>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">
            {language === "th" ? "ตรวจสอบคำตอบ" : "Review Answers"}
          </h3>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            return (
              <div
                key={i}
                className={cn(
                  "bg-white rounded-xl border p-4",
                  isCorrect ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"
                )}
              >
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-semibold text-gray-900">{q.question}</p>
                </div>
                <div className="space-y-1 ml-7">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={cn(
                        "text-sm px-3 py-1.5 rounded-lg",
                        j === q.correct && "bg-green-100 text-green-800 font-semibold",
                        j === userAnswer && j !== q.correct && "bg-red-100 text-red-800",
                        j !== q.correct && j !== userAnswer && "text-gray-600"
                      )}
                    >
                      {["A", "B", "C", "D"][j]}) {opt}
                    </div>
                  ))}
                </div>
                <div className="ml-7 mt-2 text-xs text-gray-600 bg-blue-50 rounded-lg px-3 py-2">
                  {language === "th" ? q.explanationTH : q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button onClick={reset} size="lg">
            <RotateCcw className="w-5 h-5" />
            {language === "th" ? "ทดสอบอีกครั้ง" : "Test Again"}
          </Button>
        </div>
      </div>
    );
  }

  /* Running Test */
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            {language === "th" ? "ข้อที่" : "Question"} {current + 1}/{questions.length}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            {language === "th" ? "กำลังทดสอบ" : "In progress"}
          </span>
        </div>
        <Progress value={((current + 1) / questions.length) * 100} />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Part {q.part}
          </span>
        </div>
        <p className="text-base font-semibold text-gray-900 mt-3 leading-relaxed">
          {current + 1}. {q.question}
        </p>

        <div className="space-y-3 mt-6">
          {q.options.map((opt, j) => (
            <button
              key={j}
              onClick={() => handleAnswer(j)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                answers[current] === j
                  ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
              )}
            >
              <span className="font-bold text-blue-600 mr-2">
                {["A", "B", "C", "D"][j]})
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          {language === "th" ? "ก่อนหน้า" : "Previous"}
        </Button>

        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)}>
            {language === "th" ? "ถัดไป" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-600 to-teal-600"
          >
            {t.testing.submit}
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
