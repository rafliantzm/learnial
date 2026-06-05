const geminiApiKey = process.env.GEMINI_API_KEY
const configuredModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite"

interface GeminiResponsePart {
  text?: string
}

interface GeminiResponseData {
  error?: {
    message?: string
  }
  promptFeedback?: {
    blockReason?: string
  }
  candidates?: Array<{
    content?: {
      parts?: GeminiResponsePart[]
    }
  }>
}

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY tidak ditemukan di .env.local")
}

function normalizeModelName(model: string) {
  return model.startsWith("models/") ? model.slice("models/".length) : model
}

function extractTextFromResponse(data: GeminiResponseData) {
  const parts = data?.candidates?.[0]?.content?.parts

  if (Array.isArray(parts)) {
    return parts
      .map((part) => part?.text || "")
      .join("")
      .trim()
  }

  return ""
}

function extractErrorMessage(data: GeminiResponseData) {
  return (
    data?.error?.message ||
    data?.promptFeedback?.blockReason ||
    "Google AI Studio tidak mengembalikan respons."
  )
}

export async function generateGeminiContent({
  prompt,
  systemInstruction,
  temperature = 0.5,
  maxOutputTokens = 1024,
  responseMimeType,
  model = configuredModel,
}: {
  prompt: string
  systemInstruction?: string
  temperature?: number
  maxOutputTokens?: number
  responseMimeType?: "application/json" | "text/plain"
  model?: string
}) {
  const modelName = normalizeModelName(model)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: systemInstruction
          ? {
              parts: [{ text: systemInstruction }],
            }
          : undefined,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens,
          ...(responseMimeType ? { responseMimeType } : {}),
        },
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(extractErrorMessage(data))
  }

  const text = extractTextFromResponse(data)

  if (!text) {
    throw new Error(extractErrorMessage(data))
  }

  return text
}

export function parseJsonResponse<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
