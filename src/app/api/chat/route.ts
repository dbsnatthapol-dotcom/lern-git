import { NextRequest, NextResponse } from "next/server";

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
  if (t.includes("part 2") || t.includes("question-response") || t.includes("คำถาม")) return "part2";
  if (t.includes("part 1") || t.includes("photograph") || t.includes("ภาพ")) return "part1";
  if (t.includes("score") || t.includes("990") || t.includes("คะแนน")) return "score";
  return "general";
}

const responses: Record<string, Record<string, string>> = {
  flashcard: {
    th: `นี่คือ **Flashcard คำศัพท์ธุรกิจ TOEIC** 10 คำที่ออกบ่อย 📚

---
**Word:** negotiate
**Pronunciation:** /nɪˈɡoʊʃieɪt/
**Meaning (EN):** To discuss to reach an agreement
**Meaning (TH):** เจรจาต่อรอง
**Example:** We need to negotiate the contract terms.
**TOEIC Tip:** มักออกใน Part 3/4 บทสนทนาธุรกิจ

---
**Word:** implement
**Pronunciation:** /ˈɪmplɪment/
**Meaning (EN):** To put a plan into action
**Meaning (TH):** นำไปปฏิบัติ / ดำเนินการ
**Example:** The company will implement the new policy next month.
**TOEIC Tip:** ออกบ่อยใน Part 5 เป็น verb และ noun

---
**Word:** allocate
**Pronunciation:** /ˈæləkeɪt/
**Meaning (EN):** To distribute resources for a purpose
**Meaning (TH):** จัดสรร / แบ่งปัน
**Example:** The budget was allocated to three departments.
**TOEIC Tip:** ออกใน Part 6/7 บทความธุรกิจ

---
**Word:** quarterly
**Pronunciation:** /ˈkwɔːrtərli/
**Meaning (EN):** Happening four times a year
**Meaning (TH):** รายไตรมาส / ทุกสามเดือน
**Example:** We review targets on a quarterly basis.
**TOEIC Tip:** ออกบ่อยใน Part 7 กราฟและรายงาน

---
**Word:** procurement
**Pronunciation:** /prəˈkjʊərmənt/
**Meaning (EN):** The process of obtaining goods or services
**Meaning (TH):** การจัดซื้อจัดจ้าง
**Example:** The procurement team handles all supplier contracts.
**TOEIC Tip:** ออกใน Part 4/7 บทความบริษัท

---
💡 **เคล็ดลับ:** ฝึก Flashcard วันละ 20 คำ ใน 2 เดือนจะมีคำศัพท์ 1,200 คำ ครอบคลุม TOEIC ได้ทั้งหมด! 🎯`,

    en: `Here are **10 TOEIC Business Vocabulary Flashcards** 📚

---
**Word:** negotiate
**Pronunciation:** /nɪˈɡoʊʃieɪt/
**Meaning (EN):** To discuss to reach an agreement
**Meaning (TH):** เจรจาต่อรอง
**Example:** We need to negotiate the contract terms.
**TOEIC Tip:** Common in Part 3/4 business conversations

---
**Word:** implement
**Pronunciation:** /ˈɪmplɪment/
**Meaning (EN):** To put a plan into action
**Meaning (TH):** นำไปปฏิบัติ
**Example:** The company will implement the new policy next month.
**TOEIC Tip:** Appears frequently in Part 5 as both verb and noun

---
**Word:** allocate
**Pronunciation:** /ˈæləkeɪt/
**Meaning (EN):** To distribute resources for a purpose
**Meaning (TH):** จัดสรร
**Example:** The budget was allocated to three departments.
**TOEIC Tip:** Common in Part 6/7 business texts

---
**Word:** quarterly
**Pronunciation:** /ˈkwɔːrtərli/
**Meaning (EN):** Happening four times a year
**Meaning (TH):** รายไตรมาส
**Example:** We review targets on a quarterly basis.
**TOEIC Tip:** Very common in Part 7 charts and reports

---
**Word:** procurement
**Pronunciation:** /prəˈkjʊərmənt/
**Meaning (EN):** The process of obtaining goods or services
**Meaning (TH):** การจัดซื้อจัดจ้าง
**Example:** The procurement team handles all supplier contracts.
**TOEIC Tip:** Appears in Part 4/7 company articles

---
💡 **Tip:** Study 20 flashcards daily. In 2 months you'll have 1,200 words — enough to cover all of TOEIC! 🎯`,
  },

  test: {
    th: `นี่คือ **ข้อสอบ TOEIC Part 5** ฝึกหัด 5 ข้อ ✏️

---
**Q1.** The marketing team _____ the new campaign last week.
A) launch
B) launched
C) launching
D) will launch
**Answer:** B
**Explanation (TH):** "last week" บอกว่าเป็นอดีต → ใช้ Simple Past = launched

---
**Q2.** All employees are required _____ the safety training.
A) complete
B) completing
C) to complete
D) completed
**Answer:** C
**Explanation (TH):** หลัง "required" ใช้ to + infinitive เสมอ

---
**Q3.** The report must _____ submitted before the deadline.
A) be
B) have
C) been
D) being
**Answer:** A
**Explanation (TH):** Passive Voice กับ modal: must + be + V3

---
**Q4.** _____ the heavy rain, the outdoor event was cancelled.
A) Despite
B) Because
C) Due to
D) Although
**Answer:** C
**Explanation (TH):** Due to + noun phrase | Despite + noun | Because + clause | Although + clause

---
**Q5.** The manager asked the team to work _____ on the project.
A) collaborative
B) collaboration
C) collaboratively
D) collaborate
**Answer:** C
**Explanation (TH):** ต้องใช้ Adverb (-ly) เพื่อขยาย verb "work"

---
🎯 **คะแนน:** ลองทำแล้วเช็คคำตอบ! ถ้าได้ 4-5/5 ถือว่าเก่งมากครับ 💪`,

    en: `Here are **5 TOEIC Part 5 Practice Questions** ✏️

---
**Q1.** The marketing team _____ the new campaign last week.
A) launch
B) launched
C) launching
D) will launch
**Answer:** B
**Explanation:** "last week" signals Simple Past tense → launched

---
**Q2.** All employees are required _____ the safety training.
A) complete
B) completing
C) to complete
D) completed
**Answer:** C
**Explanation:** After "required," always use to + infinitive

---
**Q3.** The report must _____ submitted before the deadline.
A) be
B) have
C) been
D) being
**Answer:** A
**Explanation:** Modal Passive = modal + be + past participle

---
**Q4.** _____ the heavy rain, the outdoor event was cancelled.
A) Despite
B) Because
C) Due to
D) Although
**Answer:** C
**Explanation:** Due to + noun phrase | Despite + noun | Because/Although + clause

---
**Q5.** The manager asked the team to work _____ on the project.
A) collaborative
B) collaboration
C) collaboratively
D) collaborate
**Answer:** C
**Explanation:** An adverb (-ly form) is needed to modify the verb "work"

---
🎯 **Score yourself!** 4-5/5 = Excellent, 3/5 = Good, 2/5 = Keep practicing 💪`,
  },

  passive: {
    th: `## 🔄 Passive Voice — อธิบายแบบเข้าใจง่าย

**Passive Voice** = ประธานถูกกระทำ (ไม่ได้ทำเอง)

### โครงสร้าง
> **Subject + to be + Past Participle (V3)**

### ตารางสรุปทุก Tense

| Tense | Active | Passive |
|-------|--------|---------|
| Present Simple | He writes the report. | The report **is written**. |
| Past Simple | She signed the contract. | The contract **was signed**. |
| Future | They will review it. | It **will be reviewed**. |
| Modal | You must complete this. | This **must be completed**. |
| Present Perfect | We have finished it. | It **has been finished**. |

### ตัวอย่างที่ออก TOEIC บ่อย
- The meeting **was postponed** until further notice.
- All applications **must be submitted** by Friday.
- The new policy **will be implemented** next quarter.
- The report **has been reviewed** by the committee.

### เทคนิคทำข้อสอบ Part 5
1. ดูว่า Subject ทำหรือถูกทำ?
2. ถ้าถูกทำ → ใช้ **be + V3**
3. ดู tense จาก context (last week = past, will = future)

💡 **จำง่ายๆ:** ถ้าตัวเลือกมี "be + V3" และ context ดูเป็น passive → นั่นคือคำตอบ! 🎯`,

    en: `## 🔄 Passive Voice — Clear & Simple

**Passive Voice** = The subject receives the action (doesn't do it)

### Structure
> **Subject + to be + Past Participle (V3)**

### All Tenses at a Glance

| Tense | Active | Passive |
|-------|--------|---------|
| Present Simple | He writes the report. | The report **is written**. |
| Past Simple | She signed the contract. | The contract **was signed**. |
| Future | They will review it. | It **will be reviewed**. |
| Modal | You must complete this. | This **must be completed**. |
| Present Perfect | We have finished it. | It **has been finished**. |

### Common TOEIC Examples
- The meeting **was postponed** until further notice.
- All applications **must be submitted** by Friday.
- The new policy **will be implemented** next quarter.

### Part 5 Strategy
1. Ask: Is the subject doing or receiving the action?
2. Receiving → use **be + V3**
3. Check tense clues (last week = past, will = future)

💡 **Quick tip:** If you see "be + V3" as an option and the subject is being acted upon, that's your answer! 🎯`,
  },

  tense: {
    th: `## ⏰ กาลกริยา (Verb Tenses) ที่ออก TOEIC บ่อย

### Time Clues — ตัวช่วยระบุ Tense
| Tense | คำบ่งชี้ใน TOEIC |
|-------|-----------------|
| Simple Past | yesterday, last week/month/year, ago, in 2023 |
| Simple Present | usually, always, every day, generally |
| Present Perfect | already, yet, just, since, for, recently |
| Future | next week, tomorrow, will, going to, soon |
| Past Perfect | before, by the time, when (+ past) |

### ตัวอย่างข้อสอบ Part 5
> The company _____ its new branch **last year**.
> A) opens B) **opened** C) has opened D) will open
> **เฉลย B** — "last year" = Simple Past

> She _____ already _____ the report.
> A) has / submitted B) had / submit C) **has / submitted** D) will / submit
> **เฉลย C** — "already" บ่งบอก Present Perfect

### เทคนิคจำ
- **SINCE** = จุดเริ่มต้น (since 2020, since Monday) → Present Perfect
- **FOR** = ระยะเวลา (for 3 years) → Present Perfect
- **AGO** = อดีต (3 years ago) → Simple Past

💡 หา Time Clue ก่อนเสมอ แล้วค่อยเลือก Tense! 🎯`,

    en: `## ⏰ TOEIC Verb Tenses — Master Guide

### Time Clues in TOEIC
| Tense | Time Clues |
|-------|-----------|
| Simple Past | yesterday, last week/month/year, ago, in 2023 |
| Simple Present | usually, always, every day, generally |
| Present Perfect | already, yet, just, since, for, recently |
| Future | next week, tomorrow, will, going to, soon |
| Past Perfect | before, by the time, when (+ past event) |

### Part 5 Examples
> The company _____ its new branch **last year**.
> A) opens B) **opened** C) has opened D) will open
> **Answer: B** — "last year" → Simple Past

> She _____ already _____ the report.
> **Answer: has / submitted** — "already" signals Present Perfect

### Key Rules
- **SINCE** = starting point → Present Perfect
- **FOR** = duration → Present Perfect
- **AGO** = past → Simple Past

💡 **Strategy:** Always spot the time clue first, then select your tense! 🎯`,
  },

  conditional: {
    th: `## 🔀 Conditionals (ประโยคเงื่อนไข)

### 4 ประเภทหลัก

**Zero Conditional** — ความจริงทั่วไป
> If + Present Simple, Present Simple
> "If you heat water to 100°C, **it boils**."

**First Conditional** — สถานการณ์จริง เป็นไปได้
> If + Present Simple, will + V1
> "If we **win** the contract, we **will hire** more staff."

**Second Conditional** — สมมติ ไม่จริงในปัจจุบัน
> If + Past Simple, would + V1
> "If I **were** the CEO, I **would expand** globally."

**Third Conditional** — สมมติในอดีต ไม่เป็นจริง
> If + Past Perfect, would have + V3
> "If she **had applied** earlier, she **would have gotten** the job."

### เทคนิคทำข้อสอบ
- เห็น **"If"** → ดู tense ในประโยค if clause
- Past Simple ใน if clause → would + V1 (Second)
- Past Perfect ใน if clause → would have + V3 (Third)

💡 จำสูตรไว้ก่อน แล้วค่อยดู if clause ว่าใช้ tense อะไร! 🎯`,

    en: `## 🔀 Conditionals — TOEIC Guide

### The 4 Types

**Zero Conditional** — General truths
> If + Present Simple, Present Simple
> "If you heat water to 100°C, **it boils**."

**First Conditional** — Real possibility
> If + Present Simple, will + V1
> "If we **win** the contract, we **will hire** more staff."

**Second Conditional** — Unreal / hypothetical present
> If + Past Simple, would + V1
> "If I **were** the CEO, I **would expand** globally."

**Third Conditional** — Unreal past
> If + Past Perfect, would have + V3
> "If she **had applied** earlier, she **would have gotten** the job."

### Test Strategy
- See **"If"** → check the if-clause tense
- Past Simple in if-clause → would + V1 (Second)
- Past Perfect in if-clause → would have + V3 (Third)

💡 Memorize the formula, then identify which clause type you're looking at! 🎯`,
  },

  plan: {
    th: `## 📅 แผนการเรียน TOEIC 3 เดือน — เป้าหมาย 800+

### เดือนที่ 1 — สร้างรากฐาน
**สัปดาห์ 1-2: คำศัพท์ + ไวยากรณ์พื้นฐาน**
- ✅ เรียนคำศัพท์วันละ 20 คำ (Business, Finance, Office)
- ✅ ทบทวน Verb Tenses ทั้งหมด
- ✅ ฝึก Passive Voice และ Conditionals

**สัปดาห์ 3-4: Listening พื้นฐาน**
- ✅ ฟัง Part 1-2 วันละ 30 นาที
- ✅ ทำ Mini Test Part 1-2 ทุกวัน

### เดือนที่ 2 — เพิ่มความเร็วและความแม่นยำ
**สัปดาห์ 5-6: Reading ครบทั้ง Part 5-7**
- ✅ Part 5: เน้น Grammar patterns 10 ประเภทหลัก
- ✅ Part 6: ฝึก Text Completion วันละ 4 บทความ
- ✅ Part 7: ฝึก Skimming & Scanning

**สัปดาห์ 7-8: Full Mock Test**
- ✅ ทำ Full Mock Test 1 ชุดทุกสัปดาห์
- ✅ วิเคราะห์ผลและเน้นจุดอ่อน

### เดือนที่ 3 — เก็บคะแนน
**สัปดาห์ 9-12: Intensive Practice**
- ✅ Mock Test 2 ชุดต่อสัปดาห์
- ✅ ทบทวนคำศัพท์ทุกวัน (Flashcard)
- ✅ AI Tutor ช่วยอธิบายข้อที่ยัง error

### เป้าหมายรายเดือน
- เดือน 1: 550+ → เดือน 2: 650+ → เดือน 3: 800+

💪 **สำเร็จแน่นอน ถ้าทำตามแผนทุกวัน!** 🏆`,

    en: `## 📅 3-Month TOEIC Study Plan — Target 800+

### Month 1 — Build the Foundation
**Week 1-2: Vocabulary + Core Grammar**
- ✅ Learn 20 new words daily (Business, Finance, Office)
- ✅ Master all Verb Tenses
- ✅ Study Passive Voice & Conditionals

**Week 3-4: Listening Basics**
- ✅ Listen to Part 1-2 for 30 min/day
- ✅ Daily Mini Tests for Part 1-2

### Month 2 — Speed & Accuracy
**Week 5-6: Full Reading (Parts 5-7)**
- ✅ Part 5: Focus on 10 core grammar patterns
- ✅ Part 6: Practice 4 text completion passages/day
- ✅ Part 7: Skimming & Scanning techniques

**Week 7-8: Full Mock Tests**
- ✅ 1 Full Mock Test per week
- ✅ Analyze results and target weak areas

### Month 3 — Score Maximization
**Week 9-12: Intensive Practice**
- ✅ 2 Mock Tests per week
- ✅ Daily flashcard review
- ✅ Use AI Tutor to clarify errors

### Monthly Milestones
- Month 1: 550+ → Month 2: 650+ → Month 3: 800+

💪 **You'll get there — consistency is everything!** 🏆`,
  },

  weakness: {
    th: `## 📊 วิเคราะห์จุดอ่อนและแนวทางพัฒนา TOEIC

จากโปรไฟล์การเรียนของคุณ นี่คือการวิเคราะห์:

### จุดแข็ง ✅
- **Part 1 (Photographs):** 80% — ดีมาก ทำต่อไป
- **Part 5 (Grammar):** 75% — เกณฑ์ดี ยังพัฒนาได้

### จุดที่ต้องพัฒนา ⚠️
**1. Part 7 — Reading (45%)** — ต่ำสุด
- ปัญหา: ใช้เวลาอ่านนานเกินไป
- แก้ไข: ฝึก Skimming → อ่านประโยคแรกของแต่ละ paragraph ก่อน
- เป้าหมาย: อ่าน passage 1 หน้าใน 3 นาที

**2. Part 3/4 — Conversations & Talks (55%)**
- ปัญหา: ตามไม่ทันเมื่อพูดเร็ว
- แก้ไข: ฝึกฟัง TED Talks / BBC Business ทุกวัน
- เป้าหมาย: จับ main idea ได้ก่อน option ปรากฏ

**3. Part 2 — Question-Response (65%)**
- ปัญหา: ตัวเลือก trap (echo response)
- แก้ไข: ระวังคำตอบที่ซ้ำคำในคำถาม → มักผิด

### แผนพัฒนา 30 วัน
- วันที่ 1-10: เน้น Part 7 Skimming/Scanning
- วันที่ 11-20: ฝึก Listening Part 3/4 ทุกวัน 30 นาที
- วันที่ 21-30: Mock Test + วิเคราะห์ผล

💡 **โฟกัสที่ Part 7 ก่อน เพราะมี 54 ข้อ — พัฒนาได้มากที่สุด!** 🎯`,

    en: `## 📊 Weakness Analysis & Improvement Plan

Based on your learning profile, here's the analysis:

### Strengths ✅
- **Part 1 (Photographs):** 80% — Excellent, keep it up
- **Part 5 (Grammar):** 75% — Good, still room to grow

### Areas Needing Work ⚠️
**1. Part 7 — Reading (45%)** — Lowest score
- Problem: Reading takes too long
- Fix: Practice Skimming → read first sentence of each paragraph
- Goal: Read a 1-page passage in 3 minutes

**2. Part 3/4 — Conversations & Talks (55%)**
- Problem: Can't keep up with fast speech
- Fix: Listen to TED Talks / BBC Business News daily
- Goal: Catch main idea before options appear on screen

**3. Part 2 — Question-Response (65%)**
- Problem: Falling for "echo response" traps
- Fix: Avoid answers that repeat words from the question — they're usually wrong

### 30-Day Improvement Plan
- Day 1-10: Focus on Part 7 Skimming & Scanning
- Day 11-20: Daily 30-min Listening practice (Part 3/4)
- Day 21-30: Full Mock Tests + detailed review

💡 **Focus on Part 7 first — it has 54 questions, biggest score impact!** 🎯`,
  },

  part7: {
    th: `## 📖 เทคนิคทำ Part 7 ให้ได้คะแนนสูง

### กลยุทธ์หลัก 5 ข้อ

**1. อ่านคำถามก่อนเสมอ**
- อ่าน 3-4 คำถามก่อนอ่าน passage
- จะรู้ว่าต้องหาอะไร → ประหยัดเวลา

**2. Skimming — จับ Main Idea**
- อ่านประโยคแรกของแต่ละ paragraph
- จับ Topic → รู้ว่าข้อมูลอยู่ที่ไหน

**3. Scanning — หา Specific Info**
- หา keyword จากคำถาม
- เช่น ถามวันที่ → Scan หาตัวเลข/เดือน

**4. Double Passage & Triple Passage**
- อ่าน passage แรกให้จบก่อน
- เชื่อมข้อมูลระหว่าง 2-3 documents

**5. ระวัง Trap คำถาม**
- NOT / EXCEPT questions — ต้องหาสิ่งที่ผิด
- Inference questions — ไม่มีในเนื้อหาตรงๆ ต้องคิด
- Paraphrase — คำตอบใช้คำต่างจากใน passage

### เวลาที่แนะนำ
- Single passage: 2-3 นาที/ชุด
- Double passage: 4-5 นาที/ชุด
- Triple passage: 5-6 นาที/ชุด

💡 **ฝึกทุกวัน passage ละ 1 ชุด ใน 4 สัปดาห์จะเห็นพัฒนาการชัดเจน!** 🎯`,

    en: `## 📖 Part 7 High-Score Strategies

### 5 Core Strategies

**1. Always Read Questions First**
- Read 3-4 questions before the passage
- Know what to look for → saves time

**2. Skimming — Grab the Main Idea**
- Read the first sentence of each paragraph
- Identify the topic → know where info is located

**3. Scanning — Find Specific Information**
- Search for keywords from the question
- Date question? Scan for numbers/months

**4. Double & Triple Passage**
- Finish the first passage entirely before moving on
- Connect information across 2-3 documents

**5. Beware of Traps**
- NOT / EXCEPT questions → find what's wrong
- Inference questions → info isn't stated directly, must reason
- Paraphrase → answer uses different words than the passage

### Recommended Timing
- Single passage: 2-3 min per set
- Double passage: 4-5 min per set
- Triple passage: 5-6 min per set

💡 **Practice 1 passage set daily. In 4 weeks you'll see clear improvement!** 🎯`,
  },

  part1: {
    th: `## 📷 Part 1 — เทคนิคทำ Photographs

### โครงสร้าง
- มี **6 ข้อ** (ข้อ 1-6)
- ดูภาพ 1 ภาพต่อ 1 ข้อ → มี 4 ตัวเลือกให้ฟัง

### กลยุทธ์
**ก่อนฟัง:**
- ดูภาพ 20 วินาที
- ระบุ: คน / สถานที่ / กิจกรรม / สิ่งของ

**ขณะฟัง:**
- ตัดตัวเลือกที่ผิดชัดออกก่อน
- ระวัง: ประโยคที่ฟังดูถูกแต่ไม่ตรงภาพ

### Traps ที่ออกบ่อย
- ❌ **Sound-alike words:** "He is writing" vs "He is riding"
- ❌ **Near-true:** สิ่งของอยู่ในภาพ แต่กิจกรรมผิด
- ❌ **Tense traps:** "is being repaired" vs "has been repaired"

### คำกริยาที่ออกบ่อย
- is talking, is walking, is holding, is sitting
- is being loaded, has been placed, is displayed
- are gathered, are lined up, are facing

💡 **เน้นดูกิจกรรมหลัก (main action) ไม่ใช่รายละเอียด!** 🎯`,

    en: `## 📷 Part 1 — Photographs Strategies

### Structure
- **6 questions** (Q1-6)
- 1 photo per question, 4 audio options each

### Strategy
**Before listening:**
- Study the photo for 20 seconds
- Identify: people / location / activity / objects

**While listening:**
- Eliminate clearly wrong options first
- Beware: sentences that sound correct but don't match the photo

### Common Traps
- ❌ **Sound-alike words:** "He is writing" vs "He is riding"
- ❌ **Near-true:** Object visible but activity is wrong
- ❌ **Tense traps:** "is being repaired" vs "has been repaired"

### High-Frequency Verbs
- is talking, is walking, is holding, is sitting
- is being loaded, has been placed, is displayed
- are gathered, are lined up, are facing

💡 **Focus on the MAIN ACTION in the photo, not minor details!** 🎯`,
  },

  score: {
    th: `## 🏆 เส้นทางสู่คะแนน TOEIC 990

### คะแนนแต่ละระดับหมายถึงอะไร?
| คะแนน | ระดับ | ความสามารถ |
|-------|-------|-----------|
| 10-250 | Beginner | สื่อสารพื้นฐานไม่ได้ |
| 255-400 | Elementary | สื่อสารได้บ้างในสถานการณ์ง่าย |
| 405-600 | Intermediate | ทำงานได้ในภาษาอังกฤษระดับพื้นฐาน |
| 605-780 | Upper-Int | ทำงานได้อย่างมีประสิทธิภาพ |
| 785-900 | Advanced | สื่อสารได้ดีในทุกสถานการณ์ |
| 905-990 | Mastery | ใกล้เคียง Native Speaker |

### จากคะแนนปัจจุบัน (650) สู่ 990
**ต้องพัฒนาอีก 340 คะแนน**

แบ่งเป็น:
- Listening: 495 คะแนน (ปัจจุบันประมาณ 310)
- Reading: 495 คะแนน (ปัจจุบันประมาณ 340)

### สิ่งที่ทำให้ได้ 990
1. **Listening 495:** ตอบถูกทั้ง 100 ข้อ (Part 1-4)
2. **Reading 495:** ตอบถูกทั้ง 100 ข้อ (Part 5-7)
3. เวลาใช้จริงๆ: 1-2 ปีที่เรียนอย่างจริงจัง

### แผน 6 เดือนสู่ 800
- เดือน 1-2: 550 → 650
- เดือน 3-4: 650 → 750
- เดือน 5-6: 750 → 800+

💪 **ความสม่ำเสมอคือกุญแจสำคัญ วันละ 1 ชั่วโมง สู่ฝันได้แน่นอน!** 🏆`,

    en: `## 🏆 The Road to TOEIC 990

### What Each Score Means
| Score | Level | Capability |
|-------|-------|-----------|
| 10-250 | Beginner | Cannot communicate in basic situations |
| 255-400 | Elementary | Can handle very simple situations |
| 405-600 | Intermediate | Can work in basic English tasks |
| 605-780 | Upper-Int | Works effectively in English |
| 785-900 | Advanced | Communicates well in all situations |
| 905-990 | Mastery | Near Native Speaker level |

### From 650 to 990 — The Gap
**340 more points needed**

Split as:
- Listening: 495 max (currently ~310)
- Reading: 495 max (currently ~340)

### What It Takes for 990
1. **Listening 495:** Answer all 100 questions correctly (Parts 1-4)
2. **Reading 495:** Answer all 100 questions correctly (Parts 5-7)
3. Realistic timeline: 1-2 years of serious study

### 6-Month Plan to 800
- Month 1-2: 550 → 650
- Month 3-4: 650 → 750
- Month 5-6: 750 → 800+

💪 **Consistency is the key — 1 hour daily will get you there!** 🏆`,
  },

  connector: {
    th: `## 🧲 Connectors & Conjunctions ที่ออก TOEIC บ่อย

### ประเภทหลัก

**Contrast (ขัดแย้ง)**
- **However** — อย่างไรก็ตาม (ขึ้นต้นประโยค + comma)
- **Although / Though / Even though** + clause
- **Despite / In spite of** + noun phrase
- **Nevertheless / Nonetheless** — อย่างไรก็ตาม

**Cause & Effect (เหตุและผล)**
- **Because / Since / As** + clause
- **Due to / Because of / Owing to** + noun phrase
- **Therefore / Thus / Hence / As a result** — ดังนั้น

**Addition (เพิ่มเติม)**
- **In addition / Furthermore / Moreover** — นอกจากนี้
- **Besides / As well as** — รวมถึง

**Time (เวลา)**
- **While / When / After / Before / Once / Until**

### Trap: Despite vs Although
- ❌ Despite **he was tired**, he finished. → ผิด
- ✅ Despite **his tiredness**, he finished. → ถูก (noun phrase)
- ✅ Although **he was tired**, he finished. → ถูก (clause)

💡 **จำกฎ:** Despite/Due to + **noun** | Although/Because + **clause** 🎯`,

    en: `## 🧲 TOEIC Connectors & Conjunctions Guide

### Main Categories

**Contrast**
- **However** — (begins sentence + comma)
- **Although / Though / Even though** + clause
- **Despite / In spite of** + noun phrase
- **Nevertheless / Nonetheless**

**Cause & Effect**
- **Because / Since / As** + clause
- **Due to / Because of / Owing to** + noun phrase
- **Therefore / Thus / Hence / As a result**

**Addition**
- **In addition / Furthermore / Moreover**
- **Besides / As well as**

**Time**
- **While / When / After / Before / Once / Until**

### Classic Trap: Despite vs Although
- ❌ Despite **he was tired**, he finished. → Wrong
- ✅ Despite **his tiredness**, he finished. → Correct (noun phrase)
- ✅ Although **he was tired**, he finished. → Correct (clause)

💡 **Golden rule:** Despite/Due to + **noun** | Although/Because + **clause** 🎯`,
  },

  part2: {
    th: `## 💬 Part 2 — Question-Response เทคนิค

### โครงสร้าง
- **25 ข้อ** (ข้อ 7-31)
- ได้ยินคำถาม 1 ประโยค → เลือกคำตอบ A/B/C

### กลยุทธ์
**1. จับ Question Word แรก**
- **Who →** คำตอบเกี่ยวกับคน
- **What →** คำตอบเกี่ยวกับสิ่งของ/เรื่อง
- **When →** คำตอบเกี่ยวกับเวลา
- **Where →** คำตอบเกี่ยวกับสถานที่
- **Why →** คำตอบบอกเหตุผล
- **How →** คำตอบบอกวิธีการ

**2. ระวัง Traps 3 แบบ**
- ❌ **Echo:** ใช้คำเดียวกับคำถาม → มักผิด
- ❌ **Sound-alike:** คำที่ฟังคล้ายกัน (mail/male)
- ❌ **Irrelevant:** ตอบนอกเรื่อง

**3. Indirect Answers**
- "When is the meeting?" → "I'll check the calendar." = ถูก ✅
- ไม่จำเป็นต้องตอบตรงๆ เสมอ

💡 **ฝึกฟังจาก real-life conversations จะช่วยได้มาก!** 🎯`,

    en: `## 💬 Part 2 — Question-Response Strategies

### Structure
- **25 questions** (Q7-31)
- Hear 1 question → choose response A/B/C

### Strategy
**1. Catch the Question Word**
- **Who →** answer about a person
- **What →** answer about a thing/topic
- **When →** answer about time
- **Where →** answer about location
- **Why →** answer gives a reason
- **How →** answer describes a method

**2. Avoid 3 Common Traps**
- ❌ **Echo:** Uses same word as question → usually wrong
- ❌ **Sound-alike:** Similar-sounding words (mail/male)
- ❌ **Irrelevant:** Off-topic response

**3. Indirect Answers Are Valid**
- "When is the meeting?" → "I'll check the calendar." = Correct ✅
- Responses don't have to be direct

💡 **Practice with real-life conversations for dramatic improvement!** 🎯`,
  },

  part3: {
    th: `## 🗣️ Part 3 — Conversations เทคนิค

### โครงสร้าง
- **39 ข้อ** (ข้อ 32-70)
- บทสนทนา 13 ชุด × 3 คำถาม/ชุด
- บางชุดมีภาพ/ตาราง (graphic-integrated)

### กลยุทธ์
**ก่อนฟัง (Preview):**
- อ่าน 3 คำถามของแต่ละชุดก่อน
- คาดเดา context ของบทสนทนา

**ขณะฟัง:**
- จับ: ความสัมพันธ์ / สถานการณ์ / ปัญหา / วิธีแก้
- ฟัง main idea ไม่ใช่ทุกคำ

**Graphic Questions:**
- ดูตาราง/แผนผังก่อนฟัง
- ฟัง clue ที่ชี้ไปที่ข้อมูลในภาพ

### คำถามที่ออกบ่อย
- "What is the conversation mainly about?"
- "What problem does the woman mention?"
- "What will the man do next?"
- "Look at the graphic. Which [item] is mentioned?"

### เทคนิค
- บทสนทนามักมี **3 โครงสร้าง:** Problem → Discussion → Solution
- ฟัง **ประโยคสุดท้าย** ให้ดี → มักเป็นคำตอบของข้อ 3

💡 **Preview คำถามเป็นสิ่งสำคัญที่สุดใน Part 3!** 🎯`,

    en: `## 🗣️ Part 3 — Conversations Strategies

### Structure
- **39 questions** (Q32-70)
- 13 conversation sets × 3 questions each
- Some sets include graphic-integrated questions

### Strategy
**Before Listening (Preview):**
- Read all 3 questions for each set first
- Predict the conversation context

**While Listening:**
- Catch: relationship / situation / problem / solution
- Listen for main ideas, not every word

**Graphic Questions:**
- Study the table/chart before the audio starts
- Listen for clues pointing to the graphic info

### Frequently Asked Question Types
- "What is the conversation mainly about?"
- "What problem does the woman mention?"
- "What will the man do next?"
- "Look at the graphic. Which [item] is mentioned?"

### Techniques
- Conversations usually follow: **Problem → Discussion → Solution**
- Pay close attention to the **last lines** → often answer Q3

💡 **Previewing questions is the single most important strategy for Part 3!** 🎯`,
  },

  article: {
    th: `## 📌 Articles: a, an, the — กฎและการใช้

### กฎพื้นฐาน

**A / AN** — indefinite (ไม่ระบุเฉพาะ)
- ใช้ครั้งแรกที่พูดถึง: "We hired **a** new manager."
- เสียงพยัญชนะ → **a**: a book, a university (/juː/)
- เสียงสระ → **an**: an office, an hour (/aʊ/)

**THE** — definite (ระบุเฉพาะ)
- พูดถึงซ้ำ: "The manager started on Monday."
- ทราบกันทั้งสองฝ่าย: "Please sign **the** contract."
- เป็นสิ่งเดียว: "**the** CEO, **the** head office"
- สิ่งที่ unique: "**the** Internet, **the** environment"

**ไม่ใช้ article**
- นามพหูพจน์ทั่วไป: "Managers are responsible for..."
- นามนับไม่ได้: "Information is important."
- ชื่อเฉพาะ: "Microsoft, Bangkok, Mr. Smith"

### ตัวอย่างที่ออก TOEIC
> "Please refer to _____ report submitted last week."
> **Answer: the** (ระบุรายงานนั้นๆ ที่ส่งไปแล้ว)

💡 **ถามตัวเองว่า:** ผู้ฟัง/อ่านรู้ว่าหมายถึงอะไร? → the | ไม่รู้ → a/an 🎯`,

    en: `## 📌 Articles: a, an, the — Rules & Usage

### Basic Rules

**A / AN** — Indefinite (non-specific)
- First mention: "We hired **a** new manager."
- Consonant sound → **a**: a book, a university (/juː/)
- Vowel sound → **an**: an office, an hour (/aʊ/)

**THE** — Definite (specific, known)
- Second mention: "The manager started on Monday."
- Both parties know: "Please sign **the** contract."
- Unique items: "**the** CEO, **the** head office"
- Unique concepts: "**the** Internet, **the** environment"

**No Article**
- General plural nouns: "Managers are responsible for..."
- Uncountable nouns: "Information is important."
- Proper nouns: "Microsoft, Bangkok, Mr. Smith"

### TOEIC Example
> "Please refer to _____ report submitted last week."
> **Answer: the** (specific report, both parties know which one)

💡 **Ask yourself:** Does the reader/listener know exactly which one? → **the** | No? → **a/an** 🎯`,
  },

  general: {
    th: `สวัสดีครับ! ผม **ADAM** ผู้ช่วย AI Tutor ของคุณ 🎯

ผมสามารถช่วยคุณเรื่องเหล่านี้ได้:

📚 **คำศัพท์ (Vocabulary)**
- พิมพ์: "สร้าง flashcard คำศัพท์ธุรกิจ"

✏️ **ข้อสอบ (Practice Test)**
- พิมพ์: "สร้างข้อสอบ Part 5"

📖 **ไวยากรณ์ (Grammar)**
- พิมพ์: "อธิบาย Passive Voice" หรือ "กาลกริยา" หรือ "Connectors"

📅 **แผนการเรียน (Study Plan)**
- พิมพ์: "สร้างแผนการเรียน 3 เดือน"

📊 **วิเคราะห์จุดอ่อน**
- พิมพ์: "วิเคราะห์จุดอ่อนของฉัน"

🎯 **เทคนิคแต่ละ Part**
- พิมพ์: "เทคนิค Part 7" หรือ "Part 3" หรือ "Part 1"

---
มีอะไรให้ช่วยไหมครับ? 😊`,

    en: `Hello! I'm **ADAM**, your TOEIC AI Tutor 🎯

I can help you with:

📚 **Vocabulary**
- Type: "Create business flashcards"

✏️ **Practice Tests**
- Type: "Generate Part 5 questions"

📖 **Grammar**
- Type: "Explain Passive Voice" or "Verb Tenses" or "Connectors"

📅 **Study Plan**
- Type: "Create a 3-month study plan"

📊 **Weakness Analysis**
- Type: "Analyze my weak areas"

🎯 **Part Strategies**
- Type: "Tips for Part 7" or "Part 3 strategy" or "Part 1"

---
What would you like to work on? 😊`,
  },
};

function getMockResponse(userText: string, language: string): string {
  const lang = language === "th" ? "th" : "en";
  const intent = detectIntent(userText);
  const bucket = responses[intent] ?? responses.general;
  return bucket[lang] ?? bucket.en;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const lastUserMsg = [...messages]
      .reverse()
      .find((m: Message) => m.role === "user");

    const userText = lastUserMsg?.content ?? "";

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

    const reply = getMockResponse(userText, language ?? "th");

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Service error" }, { status: 500 });
  }
}
