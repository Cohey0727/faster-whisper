import OpenAI from "openai"
import type { AppConfig } from "../config.js"
import type { AvatarAction } from "../types/index.js"

const VALID_ACTIONS = [
  "jump",
  "spin",
  "wave",
  "nod",
  "bow",
  "shake",
] as const satisfies readonly NonNullable<AvatarAction>[]

const SYSTEM_PROMPT = `あなたは親切なAIアシスタントです。日本語で簡潔に応答してください。

必ず以下のJSON形式で応答してください：
{"text": "応答テキスト", "action": "アクション名またはnull"}

利用可能なアクション：
- "jump" — ジャンプ、飛ぶ
- "spin" — 回転する、回る
- "wave" — 手を振る、バイバイ
- "nod" — うなずく、はい
- "bow" — お辞儀する、礼
- "shake" — 首を横に振る、いいえ

ユーザーの発言にアクションの指示が含まれていない場合は、actionをnullにしてください。`

export interface LLMResponse {
  readonly text: string
  readonly action: AvatarAction
}

function parseLLMResponse(content: string): LLMResponse {
  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) {
      return { text: content, action: null }
    }

    const parsed: unknown = JSON.parse(jsonMatch[0])

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("text" in parsed) ||
      typeof (parsed as Record<string, unknown>).text !== "string"
    ) {
      return { text: content, action: null }
    }

    const obj = parsed as Record<string, unknown>
    const text = obj.text as string
    const rawAction = obj.action
    const action =
      typeof rawAction === "string" &&
      (VALID_ACTIONS as readonly string[]).includes(rawAction)
        ? (rawAction as NonNullable<AvatarAction>)
        : null

    return { text, action }
  } catch {
    return { text: content, action: null }
  }
}

interface HistoryMessage {
  readonly role: "user" | "assistant"
  readonly content: string
}

export async function generateResponse(
  transcript: string,
  config: AppConfig,
  history: readonly HistoryMessage[] = [],
): Promise<LLMResponse> {
  const client = new OpenAI({
    apiKey: config.deepseekApiKey,
    baseURL: "https://api.deepseek.com",
  })

  try {
    const historyMessages = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...historyMessages,
        { role: "user" as const, content: transcript },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response content from DeepSeek API")
    }

    return parseLLMResponse(content)
  } catch (error) {
    if (error instanceof Error && error.message.includes("DeepSeek")) {
      throw error
    }
    throw new Error(
      `LLM generation failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
