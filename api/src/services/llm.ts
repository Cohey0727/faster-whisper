import OpenAI from "openai"
import type { AppConfig } from "../config.js"

const SYSTEM_PROMPT =
  "あなたは親切なAIアシスタントです。日本語で簡潔に応答してください。"

export async function generateResponse(
  transcript: string,
  config: AppConfig,
): Promise<string> {
  const client = new OpenAI({
    apiKey: config.deepseekApiKey,
    baseURL: "https://api.deepseek.com",
  })

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response content from DeepSeek API")
    }

    return content
  } catch (error) {
    if (error instanceof Error && error.message.includes("DeepSeek")) {
      throw error
    }
    throw new Error(
      `LLM generation failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
