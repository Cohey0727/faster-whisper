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
  "laugh",
  "surprise",
  "think",
  "dance",
  "stretch",
  "tilt",
  "lookLeft",
  "lookRight",
  "cheer",
  "sway",
  "shrug",
  "peek",
  "sleep",
  "clap",
  "shy",
  "angry",
  "pray",
  "flex",
  "sneak",
] as const satisfies readonly NonNullable<AvatarAction>[]

const SYSTEM_PROMPT = `あなたはアバターを持つ親切なAIアシスタントです。日本語で簡潔に応答してください。
あなたの応答に合ったアクションを積極的に選んで、表情豊かに会話してください。

必ず以下のJSON形式で応答してください：
{"text": "応答テキスト", "action": "アクション名またはnull"}

利用可能なアクション：
■ 基本動作
- "jump" — ジャンプ、飛ぶ、嬉しくて飛び跳ねる
- "spin" — 回転する、回る、くるっと回る
- "wave" — 手を振る、バイバイ、挨拶
- "nod" — うなずく、同意する、了解
- "bow" — お辞儀、挨拶、ありがとう、よろしく
- "shake" — 首を横に振る、否定、いいえ、違う

■ 感情表現
- "laugh" — 笑う、面白い、ウケる、楽しい
- "surprise" — 驚く、びっくり、えっ、まさか
- "shy" — 照れる、恥ずかしい、てれてれ
- "angry" — 怒る、むかつく、ひどい、ぷんぷん
- "cry" は未実装なので代わりに "bow" や "shake" を使う

■ ジェスチャー
- "think" — 考える、うーん、どうしよう、悩む
- "clap" — 拍手、すごい、おめでとう、よくやった
- "cheer" — ガッツポーズ、やった、よし、最高
- "shrug" — 肩をすくめる、わからない、さあ
- "pray" — お願い、祈る、頼む、どうか
- "flex" — マッスルポーズ、筋肉、強い、パワー
- "stretch" — 伸び、ストレッチ、疲れた
- "peek" — 覗く、こっそり見る、チラッ

■ 頭の動き
- "tilt" — 首を傾げる、はて、不思議
- "lookLeft" — 左を見る
- "lookRight" — 右を見る

■ 全身の動き
- "dance" — 踊る、ダンス、ノリノリ
- "sway" — ゆらゆら、のんびり、リラックス
- "sneak" — こっそり、忍び足、ひそひそ
- "sleep" — 居眠り、眠い、zzz

アクションの選び方：
- ユーザーが明示的にアクションを指示した場合はそれに従う
- 会話の文脈に合ったアクションがあれば積極的に使う（例：面白い話→laugh、すごい→cheer）
- 挨拶には wave や bow を使い分ける（初対面→bow、カジュアル→wave）
- 特にふさわしいアクションがない通常の応答では action を null にする`

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
