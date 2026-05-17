import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const systemWithLang = `${SYSTEM_PROMPT}\n\nCurrent app language mode: ${language === "th" ? "Thai (ภาษาไทย)" : "English"}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemWithLang,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Claude API error:", error);
    const message =
      error instanceof Error ? error.message : "AI service unavailable";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
