"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  FileImage,
  File,
  Trash2,
  Download,
  Sparkles,
  FolderOpen,
  Plus,
  Search,
} from "lucide-react";

type FileItem = {
  id: number;
  name: string;
  type: "pdf" | "docx" | "image" | "note";
  size: string;
  date: string;
  summary?: string;
};

const mockFiles: FileItem[] = [
  { id: 1, name: "TOEIC_Reading_Practice.pdf", type: "pdf", size: "2.4 MB", date: "2026-05-16", summary: "Practice reading comprehension passages with business and travel topics." },
  { id: 2, name: "Business_Vocabulary_List.docx", type: "docx", size: "184 KB", date: "2026-05-15" },
  { id: 3, name: "Grammar_Notes_Part5.docx", type: "docx", size: "256 KB", date: "2026-05-12" },
  { id: 4, name: "Listening_Script_Part3.pdf", type: "pdf", size: "1.1 MB", date: "2026-05-10" },
  { id: 5, name: "Score_Analysis_May.docx", type: "docx", size: "92 KB", date: "2026-05-08", summary: "Monthly score analysis showing 15% improvement in Part 5." },
];

const fileIcon = (type: FileItem["type"]) => {
  switch (type) {
    case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
    case "docx": return <FileText className="w-5 h-5 text-blue-500" />;
    case "image": return <FileImage className="w-5 h-5 text-green-500" />;
    default: return <File className="w-5 h-5 text-gray-500" />;
  }
};

export default function VaultPage() {
  const { t, language } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ id: number; content: string; date: string }[]>([
    { id: 1, content: language === "th" ? "จำไว้: Passive Voice ใช้ be + V3 เสมอ ในข้อสอบ Part 5 มักถามเรื่องนี้บ่อย" : "Remember: Passive Voice always uses be + V3. Very common in Part 5!", date: "2026-05-16" },
    { id: 2, content: "TOEIC Part 7: Always read the question first, then scan the passage for keywords.", date: "2026-05-14" },
  ]);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = () => {
    if (!note.trim()) return;
    setNotes((prev) => [
      { id: Date.now(), content: note.trim(), date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    setNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t.vault.title}</h1>
        <p className="text-teal-100 mt-1">{t.vault.subtitle}</p>
        <div className="flex gap-3 mt-4">
          <Button size="sm" className="bg-white text-teal-700 hover:bg-teal-50">
            <Upload className="w-4 h-4" />
            {t.vault.upload}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-500" />
                {t.vault.myFiles}
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === "th" ? "ค้นหาไฟล์..." : "Search files..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-44 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filtered.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {fileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default">{file.type.toUpperCase()}</Badge>
                      <span className="text-xs text-gray-400">{file.size}</span>
                      <span className="text-xs text-gray-400">{file.date}</span>
                    </div>
                    {file.summary && (
                      <p className="text-xs text-gray-500 mt-1.5 bg-blue-50 rounded-lg px-2 py-1.5">
                        <Sparkles className="w-3 h-3 inline mr-1 text-blue-500" />
                        {file.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {language === "th" ? "ไม่พบไฟล์" : "No files found"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-500" />
              {t.vault.notes}
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={language === "th" ? "เพิ่มบันทึกของคุณ..." : "Add a note..."}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400"
            />
            <Button size="sm" className="mt-2 w-full" onClick={addNote} disabled={!note.trim()}>
              <Plus className="w-4 h-4" />
              {language === "th" ? "เพิ่มบันทึก" : "Add Note"}
            </Button>
            <div className="mt-4 space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                  <p className="text-sm text-gray-800 leading-relaxed">{n.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{n.date}</span>
                    <button
                      onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {t.vault.summary}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {language === "th"
                ? "อัพโหลดเอกสาร TOEIC และให้ Claude AI สรุปเนื้อหาสำคัญให้คุณ"
                : "Upload TOEIC documents and let Claude AI summarize key content for you"}
            </p>
            <Button variant="outline" size="sm" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
              <Upload className="w-4 h-4" />
              {language === "th" ? "อัพโหลดเพื่อสรุป" : "Upload to Summarize"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
