import { NextRequest, NextResponse } from "next/server"
import { generateGeminiContent } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const text = await generateGeminiContent({
      systemInstruction:
        "Kamu adalah Learnial AI, asisten belajar yang ramah. Jawab dalam Bahasa Indonesia.",
      prompt: message,
      maxOutputTokens: 1024,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("ERROR:", error)
    return NextResponse.json({ text: "Error: " + error })
  }
}
