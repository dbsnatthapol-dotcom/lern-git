"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { vocabularyCategories, vocabularyWords } from "@/lib/toeic-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Star,
  BookOpen,
  Plus,
} from "lucide-react";

export default function VocabularyPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<"browse" | "flashcard">("browse");
  const [starred, setStarred] = useState<Set<number>>(new Set());

  const words = selectedCategory
    ? vocabularyWords.filter((w) => w.category === selectedCategory)
    : vocabularyWords;

  const currentWord = words[cardIndex] ?? null;

  const toggleStar = (id: number) => {
    setStarred((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex((i) => (i + 1) % words.length), 100);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex((i) => (i - 1 + words.length) % words.length), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t.vocabulary.title}</h1>
        <p className="text-blue-100 mt-1">{t.vocabulary.subtitle}</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setMode("browse")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              mode === "browse" ? "bg-white text-blue-700" : "bg-white/20 text-white"
            )}
          >
            {language === "th" ? "รายการคำศัพท์" : "Word List"}
          </button>
          <button
            onClick={() => { setMode("flashcard"); setCardIndex(0); setFlipped(false); }}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              mode === "flashcard" ? "bg-white text-blue-700" : "bg-white/20 text-white"
            )}
          >
            Flashcard
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setSelectedCategory(null); setCardIndex(0); }}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
            !selectedCategory
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          )}
        >
          {language === "th" ? "ทั้งหมด" : "All"} ({vocabularyWords.length})
        </button>
        {vocabularyCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCardIndex(0); setFlipped(false); }}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5",
              selectedCategory === cat.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            )}
          >
            <span>{cat.icon}</span>
            {language === "th" ? cat.nameTH : cat.name}
          </button>
        ))}
      </div>

      {mode === "flashcard" && currentWord ? (
        /* Flashcard Mode */
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-gray-500">
            {cardIndex + 1} / {words.length}
          </p>

          {/* Card */}
          <div
            className="w-full max-w-xl cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="relative transition-all duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                height: "280px",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-4xl font-bold mb-3">{currentWord.word}</p>
                <p className="text-blue-200 text-lg">{currentWord.pronunciation}</p>
                <Badge className="mt-4 bg-white/20 text-white border-0">
                  {currentWord.partOfSpeech}
                </Badge>
                <p className="text-blue-200 text-sm mt-6 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {language === "th" ? "แตะเพื่อดูคำแปล" : "Tap to reveal"}
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col justify-center border-2 border-blue-100"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      {language === "th" ? "ความหมาย (ไทย)" : "Thai Meaning"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {currentWord.meaningTH}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      {language === "th" ? "ความหมาย (อังกฤษ)" : "English Meaning"}
                    </p>
                    <p className="text-gray-700 mt-1">{currentWord.meaning}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-400 font-bold uppercase mb-1">Example</p>
                    <p className="text-sm text-blue-800 italic">
                      &ldquo;{language === "th" ? currentWord.exampleTH : currentWord.example}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={prevCard}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <button
              onClick={() => toggleStar(currentWord.id)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                starred.has(currentWord.id)
                  ? "bg-yellow-100 text-yellow-500"
                  : "bg-gray-100 text-gray-400 hover:text-yellow-500"
              )}
            >
              <Star className={cn("w-5 h-5", starred.has(currentWord.id) && "fill-current")} />
            </button>
            <Button onClick={nextCard}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Browse Mode */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {words.length} {language === "th" ? "คำศัพท์" : "words"}
            </p>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
              {t.vocabulary.addWord}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {words.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-gray-900">{word.word}</span>
                      <span className="text-sm text-gray-400">{word.pronunciation}</span>
                      <Badge variant={word.level === "advanced" ? "warning" : word.level === "intermediate" ? "info" : "success"}>
                        {word.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 font-semibold mt-1">{word.meaningTH}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{word.meaning}</p>
                    <p className="text-xs text-gray-400 italic mt-1.5">
                      &ldquo;{language === "th" ? word.exampleTH : word.example}&rdquo;
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStar(word.id)}
                      className={cn(
                        "transition-colors",
                        starred.has(word.id) ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                      )}
                    >
                      <Star className={cn("w-4 h-4", starred.has(word.id) && "fill-current")} />
                    </button>
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {word.synonyms.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {word.synonyms.map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
