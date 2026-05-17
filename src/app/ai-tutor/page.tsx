"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { suggestedAIQuestions } from "@/lib/toeic-data";
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  BookOpen,
  ClipboardList,
  BarChart2,
  User,
  AlertCircle,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : "bg-gradient-to-br from-purple-500 to-pink-600"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
            : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm"
        }`}
      >
        <div
          className="whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
      </div>
    </div>
  );
}

export default function AITutorPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        language === "th"
          ? `สวัสดีครับ! ผมคือ ADAM — AI Tutor ของคุณสำหรับการเตรียมสอบ TOEIC 🎯\n\nผมสามารถช่วยคุณได้:\n• **อธิบายไวยากรณ์** ทุก topic ที่ออกสอบ TOEIC\n• **สร้าง Flashcard** คำศัพท์ธุรกิจ\n• **สร้างข้อสอบฝึกหัด** แบบ TOEIC จริง\n• **วิเคราะห์จุดอ่อน** และแนะนำแผนการเรียน\n• **ตอบทุกคำถาม** เกี่ยวกับ TOEIC\n\nจะเริ่มถามอะไรก่อนดีครับ? 😊`
          : `Hello! I'm ADAM — your personal TOEIC AI Tutor 🎯\n\nI can help you with:\n• **Grammar explanations** for all TOEIC topics\n• **Vocabulary flashcards** for business English\n• **Practice questions** modeled after real TOEIC\n• **Weakness analysis** and personalized study plans\n• **Any TOEIC questions** you have\n\nWhat would you like to start with? 😊`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setError(null);

    const userMsg: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickActions = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      labelTH: "สร้าง Flashcard",
      labelEN: "Generate Flashcards",
      promptTH: "สร้าง Flashcard คำศัพท์ธุรกิจระดับ TOEIC 10 คำ",
      promptEN: "Create 10 business vocabulary flashcards for TOEIC",
    },
    {
      icon: <ClipboardList className="w-4 h-4" />,
      labelTH: "สร้างข้อสอบ",
      labelEN: "Generate Test",
      promptTH: "สร้างข้อสอบ TOEIC Part 5 จำนวน 5 ข้อ พร้อมเฉลยและคำอธิบาย",
      promptEN: "Generate 5 TOEIC Part 5 questions with answers and explanations",
    },
    {
      icon: <BarChart2 className="w-4 h-4" />,
      labelTH: "วิเคราะห์จุดอ่อน",
      labelEN: "Analyze Weakness",
      promptTH: "ช่วยวิเคราะห์จุดอ่อนที่ควรพัฒนาเพื่อไปถึงคะแนน 990 และแนะนำแผนการเรียน 3 เดือน",
      promptEN: "Analyze my weak points and suggest a 3-month study plan to reach score 990",
    },
  ];

  const suggestions = suggestedAIQuestions[language];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl">{t.aiTutor.title}</h1>
          <p className="text-purple-100 text-sm">{t.aiTutor.subtitle}</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 text-xs bg-white/20 rounded-full px-3 py-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Claude AI
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="text-xs text-gray-400 ml-1">{t.aiTutor.thinking}</span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.aiTutor.placeholder}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 max-h-32 overflow-y-auto"
                style={{ minHeight: "44px" }}
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 pl-1">
              {language === "th" ? "Enter ส่ง • Shift+Enter ขึ้นบรรทัดใหม่" : "Enter to send • Shift+Enter for new line"}
            </p>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              {language === "th" ? "คำสั่งด่วน" : "Quick Actions"}
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() =>
                    sendMessage(
                      language === "th" ? action.promptTH : action.promptEN
                    )
                  }
                  disabled={loading}
                  className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-xs font-medium text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50"
                >
                  <span className="text-purple-500">{action.icon}</span>
                  {language === "th" ? action.labelTH : action.labelEN}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">
              {t.aiTutor.suggestedQuestions}
            </h3>
            <div className="space-y-1.5">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Chat */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content:
                    language === "th"
                      ? "เริ่มการสนทนาใหม่แล้วครับ! มีอะไรให้ช่วยไหมครับ? 😊"
                      : "New conversation started! How can I help you? 😊",
                },
              ])
            }
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {t.aiTutor.clearChat}
          </Button>
        </div>
      </div>
    </div>
  );
}
