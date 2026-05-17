import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// ถ้าไม่มี API key จะใช้ demo mode อัตโนมัติ
const USE_DEMO = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key_here";

const client = USE_DEMO ? null : new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are ADAM — an expert TOEIC AI Tutor built into the ADAM TOEIC APP 990 SCORE platform. You help Thai learners achieve a perfect TOEIC score of 990.

Your expertise covers:
- All 7 TOEIC parts (Listening Parts 1-4, Reading Parts 5-7)
- English grammar with clear Thai/English explanations
- Business vocabulary and TOEIC-specific vocabulary
- Test-taking strategies and techniques
- Personalized study plans
- Weakness analysis and improvement roadmaps

Behavior rules:
- When the user writes in Thai, respond in Thai (with English examples/terms where needed)
- When the user writes in English, respond in English (with Thai translations for key terms)
- Always provide practical examples relevant to TOEIC
- Be encouraging and motivating
- Format your responses clearly using markdown when helpful
- When generating flashcards, use this format:
  **Word:** [word]
  **Pronunciation:** [/pronunciation/]
  **Meaning (EN):** [meaning]
  **Meaning (TH):** [Thai meaning]
  **Example:** [example sentence]
  **TOEIC Tip:** [how this word appears in TOEIC]

- When generating test questions, use this format:
  **Q[number].** [question]
  A) [option A]
  B) [option B]
  C) [option C]
  D) [option D]
  **Answer:** [correct letter]
  **Explanation (TH):** [Thai explanation]

You are friendly, knowledgeable, and dedicated to helping users reach their target TOEIC score.`;

// ==============================
// DEMO MODE — ไม่ต้องใช้ API Key
// ==============================
type Message = { role: string; content: string };

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("flashcard") || t.includes("คำศัพท์") || t.includes("vocab")) return "flashcard";
  if (t.includes("ข้อสอบ") || t.includes("generate test") || t.includes("practice question") || t.includes("part 5")) return "test";
  if (t.includes("passive") || t.includes("passive voice")) return "passive";
  if (t.includes("tense") || t.includes("กาล") || t.includes("present") || t.includes("past")) return "tense";
  if (t.includes("conditional") || t.includes("if clause") || t.includes("เงื่อนไข")) return "conditional";
  if (t.includes("article") || t.includes(" a ") || t.includes(" an ") || t.includes(" the ")) return "article";
  if (t.includes("connector") || t.includes("conjunction") || t.includes("คำเชื่อม") || t.includes("due to") || t.includes("however")) return "connector";
  if (t.includes("plan") || t.includes("แผน") || t.includes("study plan") || t.includes("roadmap")) return "plan";
  if (t.includes("weak") || t.includes("จุดอ่อน") || t.includes("improve") || t.includes("วิเคราะห์")) return "weakness";
  if (t.includes("part 7") || t.includes("reading")) return "part7";
  if (t.includes("part 3") || t.includes("conversation") || t.includes("บทสนทนา")) return "part3";
  if (t.includes("part 2") || t.includes("question-response")) return "part2";
  if (t.includes("part 1") || t.includes("photograph") || t.includes("ภาพ")) return "part1";
  if (t.includes("score") || t.includes("990") || t.includes("คะแนน")) return "score";
  return "general";
}

const demoResponses: Record<string, Record<string, string>> = {
  flashcard: {
    th: `นี่คือ **Flashcard คำศัพท์ธุรกิจ TOEIC** 📚\n\n---\n**Word:** negotiate\n**Pronunciation:** /nɪˈɡoʊʃieɪt/\n**Meaning (EN):** To discuss to reach an agreement\n**Meaning (TH):** เจรจาต่อรอง\n**Example:** We need to negotiate the contract terms.\n**TOEIC Tip:** ออกบ่อยใน Part 3/4 บทสนทนาธุรกิจ\n\n---\n**Word:** implement\n**Pronunciation:** /ˈɪmplɪment/\n**Meaning (EN):** To put a plan into action\n**Meaning (TH):** นำไปปฏิบัติ\n**Example:** The company will implement the new policy next month.\n**TOEIC Tip:** ออกบ่อยใน Part 5 ทั้ง verb และ noun\n\n---\n**Word:** allocate\n**Pronunciation:** /ˈæləkeɪt/\n**Meaning (EN):** To distribute resources for a purpose\n**Meaning (TH):** จัดสรร\n**Example:** The budget was allocated to three departments.\n**TOEIC Tip:** ออกใน Part 6/7 บทความธุรกิจ\n\n💡 ฝึก Flashcard วันละ 20 คำ ใน 2 เดือนจะมีคำศัพท์ 1,200 คำ! 🎯`,
    en: `Here are **TOEIC Business Vocabulary Flashcards** 📚\n\n---\n**Word:** negotiate /nɪˈɡoʊʃieɪt/ (verb)\n**Meaning (EN):** To discuss to reach an agreement\n**Meaning (TH):** เจรจาต่อรอง\n**Example:** We need to negotiate the contract terms.\n**TOEIC Tip:** Common in Part 3/4 business conversations\n\n---\n**Word:** implement /ˈɪmplɪment/ (verb)\n**Meaning (EN):** To put a plan into action\n**Meaning (TH):** นำไปปฏิบัติ\n**Example:** The company will implement the new policy next month.\n**TOEIC Tip:** Frequent in Part 5 as both verb and noun\n\n---\n**Word:** allocate /ˈæləkeɪt/ (verb)\n**Meaning (EN):** To distribute resources for a purpose\n**Meaning (TH):** จัดสรร\n**Example:** The budget was allocated to three departments.\n**TOEIC Tip:** Common in Part 6/7 business texts\n\n💡 Study 20 flashcards daily — 1,200 words in 2 months! 🎯`,
  },
  test: {
    th: `**ข้อสอบ TOEIC Part 5** ฝึกหัด 5 ข้อ ✏️\n\n---\n**Q1.** The marketing team _____ the new campaign last week.\nA) launch  B) launched  C) launching  D) will launch\n**Answer:** B\n**Explanation (TH):** "last week" → Simple Past = launched\n\n---\n**Q2.** All employees are required _____ the safety training.\nA) complete  B) completing  C) to complete  D) completed\n**Answer:** C\n**Explanation (TH):** หลัง required ใช้ to + infinitive\n\n---\n**Q3.** The report must _____ submitted before the deadline.\nA) be  B) have  C) been  D) being\n**Answer:** A\n**Explanation (TH):** Modal Passive = must + be + V3\n\n---\n**Q4.** _____ the heavy rain, the outdoor event was cancelled.\nA) Despite  B) Because  C) Due to  D) Although\n**Answer:** C\n**Explanation (TH):** Due to + noun phrase | Although + clause\n\n---\n**Q5.** The manager asked the team to work _____ on the project.\nA) collaborative  B) collaboration  C) collaboratively  D) collaborate\n**Answer:** C\n**Explanation (TH):** ต้องใช้ Adverb (-ly) ขยาย verb "work"\n\n🎯 4-5/5 = ยอดเยี่ยม | 3/5 = ดี | ต่ำกว่า = ฝึกเพิ่ม! 💪`,
    en: `**TOEIC Part 5 Practice** — 5 Questions ✏️\n\n---\n**Q1.** The marketing team _____ the new campaign last week.\nA) launch  B) launched  C) launching  D) will launch\n**Answer:** B — "last week" signals Simple Past\n\n---\n**Q2.** All employees are required _____ the safety training.\nA) complete  B) completing  C) to complete  D) completed\n**Answer:** C — After "required," use to + infinitive\n\n---\n**Q3.** The report must _____ submitted before the deadline.\nA) be  B) have  C) been  D) being\n**Answer:** A — Modal Passive = modal + be + V3\n\n---\n**Q4.** _____ the heavy rain, the outdoor event was cancelled.\nA) Despite  B) Because  C) Due to  D) Although\n**Answer:** C — Due to + noun phrase\n\n---\n**Q5.** The manager asked the team to work _____ on the project.\nA) collaborative  B) collaboration  C) collaboratively  D) collaborate\n**Answer:** C — Adverb (-ly) needed to modify verb "work"\n\n🎯 Score: 4-5/5 = Excellent | 3/5 = Good | Below = Keep practicing! 💪`,
  },
  passive: {
    th: `## 🔄 Passive Voice\n\n**โครงสร้าง:** Subject + to be + V3\n\n| Tense | Passive |\n|-------|---------|\n| Present | is/am/are + V3 |\n| Past | was/were + V3 |\n| Future | will be + V3 |\n| Modal | must/can/should be + V3 |\n| Perfect | have/has been + V3 |\n\n**ตัวอย่าง TOEIC:**\n- The meeting **was postponed** until further notice.\n- All applications **must be submitted** by Friday.\n- The new policy **will be implemented** next quarter.\n\n**เทคนิค Part 5:**\n1. ดูว่า Subject ทำหรือถูกทำ?\n2. ถูกทำ → be + V3\n3. ดู tense จาก time clue\n\n💡 ถ้าเห็น "be + V3" และ subject ถูกกระทำ = คำตอบถูก! 🎯`,
    en: `## 🔄 Passive Voice\n\n**Structure:** Subject + to be + V3\n\n| Tense | Passive |\n|-------|---------|\n| Present | is/am/are + V3 |\n| Past | was/were + V3 |\n| Future | will be + V3 |\n| Modal | must/can/should be + V3 |\n| Perfect | have/has been + V3 |\n\n**TOEIC Examples:**\n- The meeting **was postponed** until further notice.\n- All applications **must be submitted** by Friday.\n- The new policy **will be implemented** next quarter.\n\n**Part 5 Strategy:**\n1. Is the subject doing or receiving the action?\n2. Receiving → be + V3\n3. Check time clues for tense\n\n💡 If you see "be + V3" and subject is acted upon = correct answer! 🎯`,
  },
  plan: {
    th: `## 📅 แผนการเรียน TOEIC 3 เดือน\n\n**เดือน 1 — รากฐาน**\n- สัปดาห์ 1-2: คำศัพท์ 20 คำ/วัน + Tenses ครบ\n- สัปดาห์ 3-4: Passive Voice, Conditionals, Connectors\n- เป้าหมาย: 550+\n\n**เดือน 2 — เพิ่มความแม่นยำ**\n- สัปดาห์ 5-6: Part 5/6/7 ครบ + Mock Test รายสัปดาห์\n- สัปดาห์ 7-8: Listening Part 3/4 วันละ 30 นาที\n- เป้าหมาย: 650+\n\n**เดือน 3 — เก็บคะแนน**\n- Mock Test 2 ชุด/สัปดาห์\n- วิเคราะห์จุดอ่อน + ทบทวน Flashcard\n- เป้าหมาย: 800+\n\n💪 วันละ 1 ชั่วโมง สม่ำเสมอ = ผลลัพธ์ที่แน่นอน! 🏆`,
    en: `## 📅 3-Month TOEIC Study Plan\n\n**Month 1 — Foundation**\n- Week 1-2: 20 vocab/day + all Tenses\n- Week 3-4: Passive Voice, Conditionals, Connectors\n- Target: 550+\n\n**Month 2 — Accuracy**\n- Week 5-6: Parts 5/6/7 + weekly Mock Test\n- Week 7-8: Listening Parts 3/4 — 30 min daily\n- Target: 650+\n\n**Month 3 — Score Maximization**\n- 2 Mock Tests per week\n- Weakness analysis + Flashcard review\n- Target: 800+\n\n💪 1 hour daily, consistently = guaranteed results! 🏆`,
  },
  general: {
    th: `สวัสดีครับ! ผม **ADAM** AI Tutor ของคุณ 🎯\n\nถามผมได้เลยเรื่อง:\n- 📚 "สร้าง flashcard คำศัพท์"\n- ✏️ "สร้างข้อสอบ Part 5"\n- 📖 "อธิบาย Passive Voice / Tenses / Conditionals"\n- 📅 "แผนการเรียน 3 เดือน"\n- 📊 "วิเคราะห์จุดอ่อน"\n- 🎯 "เทคนิค Part 7 / Part 3"\n\nมีอะไรให้ช่วยไหมครับ? 😊`,
    en: `Hello! I'm **ADAM**, your TOEIC AI Tutor 🎯\n\nAsk me about:\n- 📚 "Create vocabulary flashcards"\n- ✏️ "Generate Part 5 questions"\n- 📖 "Explain Passive Voice / Tenses / Conditionals"\n- 📅 "Create a 3-month study plan"\n- 📊 "Analyze my weak areas"\n- 🎯 "Tips for Part 7 / Part 3"\n\nWhat would you like to work on? 😊`,
  },
  weakness: {
    th: `## 📊 วิเคราะห์จุดอ่อน\n\n**จุดแข็ง ✅**\n- Part 1: 80% — ดีมาก\n- Part 5: 75% — ดี\n\n**ต้องพัฒนา ⚠️**\n\n**1. Part 7 (45%)** — ต่ำสุด\n- ปัญหา: อ่านนานเกินไป\n- แก้: ฝึก Skimming อ่านประโยคแรกของทุก paragraph ก่อน\n\n**2. Part 3/4 (55%)**\n- ปัญหา: ตามไม่ทันเมื่อพูดเร็ว\n- แก้: ฟัง TED Talks / BBC ทุกวัน\n\n**3. Part 2 (65%)**\n- ปัญหา: โดน echo response หลอก\n- แก้: ตัดคำตอบที่ซ้ำคำในคำถามออก\n\n💡 โฟกัส Part 7 ก่อน — 54 ข้อ ผลกระทบมากที่สุด! 🎯`,
    en: `## 📊 Weakness Analysis\n\n**Strengths ✅**\n- Part 1: 80% — Excellent\n- Part 5: 75% — Good\n\n**Needs Improvement ⚠️**\n\n**1. Part 7 (45%)** — Lowest\n- Problem: Takes too long to read\n- Fix: Practice Skimming — read first sentence of each paragraph\n\n**2. Part 3/4 (55%)**\n- Problem: Can't keep up with fast speech\n- Fix: Listen to TED Talks / BBC News daily\n\n**3. Part 2 (65%)**\n- Problem: Falling for echo response traps\n- Fix: Eliminate answers that repeat question words\n\n💡 Focus on Part 7 first — 54 questions, biggest score impact! 🎯`,
  },
  part7: {
    th: `## 📖 เทคนิค Part 7 — Reading\n\n**5 กลยุทธ์หลัก**\n\n1. **อ่านคำถามก่อนเสมอ** — รู้ว่าต้องหาอะไร ประหยัดเวลา\n2. **Skimming** — อ่านประโยคแรกของแต่ละ paragraph จับ main idea\n3. **Scanning** — หา keyword จากคำถามใน passage\n4. **Double/Triple Passage** — อ่าน passage แรกให้จบก่อน แล้วเชื่อมข้อมูล\n5. **ระวัง Traps:** NOT/EXCEPT, Inference, Paraphrase\n\n**เวลาที่แนะนำ:**\n- Single passage: 2-3 นาที\n- Double passage: 4-5 นาที\n- Triple passage: 5-6 นาที\n\n💡 ฝึก 1 passage set ต่อวัน ใน 4 สัปดาห์เห็นพัฒนาการชัดเจน! 🎯`,
    en: `## 📖 Part 7 Reading Strategies\n\n**5 Core Strategies**\n\n1. **Read questions first** — know what to look for, save time\n2. **Skimming** — read first sentence of each paragraph for main idea\n3. **Scanning** — search for keywords from questions in passage\n4. **Double/Triple Passage** — finish first passage, then connect info\n5. **Watch for Traps:** NOT/EXCEPT, Inference, Paraphrase questions\n\n**Recommended Timing:**\n- Single passage: 2-3 min\n- Double passage: 4-5 min\n- Triple passage: 5-6 min\n\n💡 Practice 1 passage set daily — clear improvement in 4 weeks! 🎯`,
  },
  score: {
    th: `## 🏆 เส้นทางสู่ 990\n\n| คะแนน | ระดับ |\n|-------|-------|\n| 10-400 | Beginner |\n| 405-600 | Intermediate |\n| 605-780 | Upper-Intermediate |\n| 785-900 | Advanced |\n| 905-990 | Mastery |\n\n**จาก 650 → 990 ต้องพัฒนา 340 คะแนน**\n- Listening: เพิ่มจาก ~310 → 495\n- Reading: เพิ่มจาก ~340 → 495\n\n**Timeline ที่ทำได้จริง:**\n- เดือน 1-2: 650 → 700\n- เดือน 3-4: 700 → 800\n- เดือน 5-6: 800 → 850\n- 1-2 ปี จริงจัง: 990\n\n💪 ความสม่ำเสมอคือกุญแจสำคัญ! 🏆`,
    en: `## 🏆 The Road to 990\n\n| Score | Level |\n|-------|-------|\n| 10-400 | Beginner |\n| 405-600 | Intermediate |\n| 605-780 | Upper-Intermediate |\n| 785-900 | Advanced |\n| 905-990 | Mastery |\n\n**From 650 → 990: need 340 more points**\n- Listening: ~310 → 495\n- Reading: ~340 → 495\n\n**Realistic Timeline:**\n- Month 1-2: 650 → 700\n- Month 3-4: 700 → 800\n- Month 5-6: 800 → 850\n- 1-2 years serious study: 990\n\n💪 Consistency is the key! 🏆`,
  },
  tense: {
    th: `## ⏰ Verb Tenses สำหรับ TOEIC\n\n**Time Clues สำคัญ:**\n| Tense | คำบ่งชี้ |\n|-------|----------|\n| Simple Past | yesterday, last week, ago, in 2023 |\n| Simple Present | usually, always, every day |\n| Present Perfect | already, yet, just, since, for, recently |\n| Future | next week, tomorrow, will, soon |\n| Past Perfect | before, by the time, when (+past) |\n\n**ตัวอย่าง:**\n- "last year" → **opened** (Simple Past)\n- "already" → **has submitted** (Present Perfect)\n- "next month" → **will implement** (Future)\n\n💡 หา Time Clue ก่อนเสมอ แล้วค่อยเลือก Tense! 🎯`,
    en: `## ⏰ TOEIC Verb Tenses\n\n**Key Time Clues:**\n| Tense | Clues |\n|-------|-------|\n| Simple Past | yesterday, last week, ago, in 2023 |\n| Simple Present | usually, always, every day |\n| Present Perfect | already, yet, just, since, for, recently |\n| Future | next week, tomorrow, will, soon |\n| Past Perfect | before, by the time, when (+past) |\n\n**Examples:**\n- "last year" → **opened** (Simple Past)\n- "already" → **has submitted** (Present Perfect)\n- "next month" → **will implement** (Future)\n\n💡 Always spot the time clue first, then select your tense! 🎯`,
  },
  conditional: {
    th: `## 🔀 Conditionals ทั้ง 4 ประเภท\n\n**Zero:** If + Present, Present (ความจริงทั่วไป)\n> "If you heat water to 100°C, it boils."\n\n**First:** If + Present, will + V1 (เป็นไปได้)\n> "If we win the contract, we will hire more staff."\n\n**Second:** If + Past, would + V1 (สมมติ ไม่จริง)\n> "If I were the CEO, I would expand globally."\n\n**Third:** If + Past Perfect, would have + V3 (อดีต สมมติ)\n> "If she had applied earlier, she would have gotten the job."\n\n**เทคนิค:**\n- Past Simple ใน if → would + V1\n- Past Perfect ใน if → would have + V3\n\n💡 ดู if clause ก่อน แล้วค่อยเลือกสูตร! 🎯`,
    en: `## 🔀 All 4 Conditionals\n\n**Zero:** If + Present, Present (general truth)\n> "If you heat water to 100°C, it boils."\n\n**First:** If + Present, will + V1 (real possibility)\n> "If we win the contract, we will hire more staff."\n\n**Second:** If + Past, would + V1 (hypothetical)\n> "If I were the CEO, I would expand globally."\n\n**Third:** If + Past Perfect, would have + V3 (past unreal)\n> "If she had applied earlier, she would have gotten the job."\n\n**Strategy:**\n- Past Simple in if → would + V1\n- Past Perfect in if → would have + V3\n\n💡 Identify the if-clause tense first, then apply the formula! 🎯`,
  },
  connector: {
    th: `## 🧲 Connectors ที่ออก TOEIC บ่อย\n\n**Contrast (ขัดแย้ง):**\n- Although / Though / Even though + clause\n- Despite / In spite of + noun phrase\n- However / Nevertheless (ขึ้นต้นประโยค)\n\n**Cause & Effect (เหตุผล):**\n- Because / Since / As + clause\n- Due to / Because of / Owing to + noun phrase\n- Therefore / Thus / Hence / As a result\n\n**Addition (เพิ่มเติม):**\n- In addition / Furthermore / Moreover\n\n**Trap สำคัญ:**\n- ❌ Despite **he was tired** → ผิด\n- ✅ Despite **his tiredness** → ถูก (noun phrase)\n- ✅ Although **he was tired** → ถูก (clause)\n\n💡 Despite/Due to + noun | Although/Because + clause 🎯`,
    en: `## 🧲 TOEIC Connectors Guide\n\n**Contrast:**\n- Although / Though / Even though + clause\n- Despite / In spite of + noun phrase\n- However / Nevertheless (sentence starters)\n\n**Cause & Effect:**\n- Because / Since / As + clause\n- Due to / Because of / Owing to + noun phrase\n- Therefore / Thus / Hence / As a result\n\n**Addition:**\n- In addition / Furthermore / Moreover\n\n**Classic Trap:**\n- ❌ Despite **he was tired** → Wrong\n- ✅ Despite **his tiredness** → Correct (noun phrase)\n- ✅ Although **he was tired** → Correct (clause)\n\n💡 Despite/Due to + noun | Although/Because + clause 🎯`,
  },
  article: {
    th: `## 📌 Articles: a, an, the\n\n**A / AN** — ไม่ระบุเฉพาะ\n- พูดถึงครั้งแรก: "We hired **a** manager."\n- เสียงพยัญชนะ → a | เสียงสระ → an\n\n**THE** — ระบุเฉพาะ\n- พูดถึงซ้ำ / ทราบกันทั้งคู่ / สิ่งเดียว\n- "Please sign **the** contract."\n- "**the** CEO, **the** Internet"\n\n**ไม่ใช้ article:**\n- นามพหูพจน์ทั่วไป: "Managers are responsible..."\n- นามนับไม่ได้: "Information is important."\n- ชื่อเฉพาะ: "Microsoft, Bangkok"\n\n💡 ถามตัวเองว่า: ผู้อ่านรู้ว่าหมายถึงอะไร? → the | ไม่รู้ → a/an 🎯`,
    en: `## 📌 Articles: a, an, the\n\n**A / AN** — Indefinite (non-specific)\n- First mention: "We hired **a** manager."\n- Consonant sound → a | Vowel sound → an\n\n**THE** — Definite (specific, known)\n- Second mention / both parties know / unique\n- "Please sign **the** contract."\n- "**the** CEO, **the** Internet"\n\n**No Article:**\n- General plurals: "Managers are responsible..."\n- Uncountable nouns: "Information is important."\n- Proper nouns: "Microsoft, Bangkok"\n\n💡 Ask: Does the reader know exactly which one? → the | No? → a/an 🎯`,
  },
  part1: {
    th: `## 📷 Part 1 — Photographs\n\n**โครงสร้าง:** 6 ข้อ (Q1-6) ดูภาพ → ฟัง 4 ตัวเลือก\n\n**กลยุทธ์:**\n1. ดูภาพ 20 วิก่อนฟัง — ระบุ คน/สถานที่/กิจกรรม\n2. ตัดตัวเลือกผิดชัดออกก่อน\n3. ระวัง sound-alike words\n\n**Traps:**\n- ❌ Sound-alike: "writing" vs "riding"\n- ❌ Near-true: สิ่งของในภาพ แต่กิจกรรมผิด\n- ❌ Tense: "is being repaired" vs "has been repaired"\n\n**คำกริยาที่ออกบ่อย:**\n- is talking, is walking, is holding, is sitting\n- is being loaded, has been placed, is displayed\n- are gathered, are lined up, are facing\n\n💡 เน้นดู main action ไม่ใช่รายละเอียดเล็กน้อย! 🎯`,
    en: `## 📷 Part 1 — Photographs\n\n**Structure:** 6 questions (Q1-6), 1 photo → 4 audio options\n\n**Strategy:**\n1. Study photo 20 sec before audio — identify people/place/activity\n2. Eliminate clearly wrong options first\n3. Watch for sound-alike words\n\n**Traps:**\n- ❌ Sound-alike: "writing" vs "riding"\n- ❌ Near-true: object visible but activity is wrong\n- ❌ Tense: "is being repaired" vs "has been repaired"\n\n**High-Frequency Verbs:**\n- is talking, is walking, is holding, is sitting\n- is being loaded, has been placed, is displayed\n- are gathered, are lined up, are facing\n\n💡 Focus on the MAIN ACTION, not minor details! 🎯`,
  },
  part2: {
    th: `## 💬 Part 2 — Question-Response\n\n**โครงสร้าง:** 25 ข้อ (Q7-31) ฟัง 1 คำถาม → เลือก A/B/C\n\n**จับ Question Word แรก:**\n- Who → คำตอบเกี่ยวกับคน\n- What → สิ่งของ/เรื่อง\n- When → เวลา\n- Where → สถานที่\n- Why → เหตุผล\n- How → วิธีการ\n\n**Traps 3 แบบ:**\n- ❌ Echo: ใช้คำเดียวกับคำถาม\n- ❌ Sound-alike: คำฟังคล้ายกัน\n- ❌ Irrelevant: ตอบนอกเรื่อง\n\n**Indirect Answers ถือว่าถูกได้:**\n- "When is the meeting?" → "I'll check the calendar." ✅\n\n💡 ตัดตัวเลือกที่ซ้ำคำในคำถามออกก่อนเลย! 🎯`,
    en: `## 💬 Part 2 — Question-Response\n\n**Structure:** 25 questions (Q7-31), hear 1 question → choose A/B/C\n\n**Catch the Question Word:**\n- Who → answer about a person\n- What → thing/topic\n- When → time\n- Where → location\n- Why → reason\n- How → method\n\n**3 Common Traps:**\n- ❌ Echo: repeats words from the question\n- ❌ Sound-alike: similar-sounding words\n- ❌ Irrelevant: off-topic response\n\n**Indirect Answers Are Valid:**\n- "When is the meeting?" → "I'll check the calendar." ✅\n\n💡 Eliminate any option that repeats question words first! 🎯`,
  },
  part3: {
    th: `## 🗣️ Part 3 — Conversations\n\n**โครงสร้าง:** 39 ข้อ (Q32-70) 13 ชุด × 3 คำถาม\n\n**กลยุทธ์:**\n1. **Preview** — อ่าน 3 คำถามก่อนฟังทุกครั้ง\n2. จับ: ความสัมพันธ์ / สถานการณ์ / ปัญหา / วิธีแก้\n3. Graphic questions — ดูตาราง/แผนผังก่อนฟัง\n\n**บทสนทนา TOEIC มักเป็น:**\nProblem → Discussion → Solution\n\n**ฟังประโยคสุดท้ายให้ดี** → มักเป็นคำตอบข้อ 3\n\n**คำถามที่ออกบ่อย:**\n- "What is the conversation mainly about?"\n- "What problem does the woman mention?"\n- "What will the man do next?"\n\n💡 Preview คำถามก่อนคือสิ่งสำคัญที่สุด! 🎯`,
    en: `## 🗣️ Part 3 — Conversations\n\n**Structure:** 39 questions (Q32-70), 13 sets × 3 questions\n\n**Strategy:**\n1. **Preview** — read all 3 questions before each audio\n2. Catch: relationship / situation / problem / solution\n3. Graphic questions — study table/chart before listening\n\n**TOEIC conversations usually follow:**\nProblem → Discussion → Solution\n\n**Listen carefully to the last lines** → often answer Q3\n\n**Common Question Types:**\n- "What is the conversation mainly about?"\n- "What problem does the woman mention?"\n- "What will the man do next?"\n\n💡 Previewing questions is the single most important strategy! 🎯`,
  },
};

function getMockResponse(userText: string, language: string): string {
  const lang = language === "th" ? "th" : "en";
  const t = userText.toLowerCase();
  let intent = "general";
  if (t.includes("flashcard") || t.includes("คำศัพท์") || t.includes("vocab")) intent = "flashcard";
  else if (t.includes("ข้อสอบ") || t.includes("generate test") || t.includes("practice question") || t.includes("part 5")) intent = "test";
  else if (t.includes("passive")) intent = "passive";
  else if (t.includes("tense") || t.includes("กาล")) intent = "tense";
  else if (t.includes("conditional") || t.includes("เงื่อนไข")) intent = "conditional";
  else if (t.includes("connector") || t.includes("คำเชื่อม") || t.includes("due to")) intent = "connector";
  else if (t.includes("article") || t.includes(" the ") || t.includes(" a ")) intent = "article";
  else if (t.includes("plan") || t.includes("แผน")) intent = "plan";
  else if (t.includes("weak") || t.includes("จุดอ่อน") || t.includes("วิเคราะห์")) intent = "weakness";
  else if (t.includes("part 7") || t.includes("reading")) intent = "part7";
  else if (t.includes("part 3") || t.includes("conversation")) intent = "part3";
  else if (t.includes("part 2")) intent = "part2";
  else if (t.includes("part 1") || t.includes("photograph") || t.includes("ภาพ")) intent = "part1";
  else if (t.includes("score") || t.includes("990") || t.includes("คะแนน")) intent = "score";
  const bucket = demoResponses[intent] ?? demoResponses.general;
  return bucket[lang] ?? bucket.en;
}

// ==============================
// MAIN HANDLER
// ==============================
export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Demo mode — ไม่มี API key
    if (USE_DEMO) {
      const lastUser = [...messages].reverse().find((m: Message) => m.role === "user");
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
      return NextResponse.json({ message: getMockResponse(lastUser?.content ?? "", language ?? "th"), mode: "demo" });
    }

    // Real Claude AI mode
    const systemWithLang = `${SYSTEM_PROMPT}\n\nCurrent app language mode: ${language === "th" ? "Thai (ภาษาไทย)" : "English"}`;
    const response = await client!.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemWithLang,
      messages: messages.map((m: Message) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text, mode: "ai" });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Service error" }, { status: 500 });
  }
}
