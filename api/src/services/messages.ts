import { prisma } from "../db/index.js"

interface MessageForLLM {
  readonly role: "user" | "assistant"
  readonly content: string
}

export async function saveMessage(
  role: "user" | "assistant",
  content: string,
) {
  return prisma.message.create({
    data: { role, content },
  })
}

export async function getRecentMessages(limit = 50) {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  })
  return messages.reverse()
}

export async function getMessagesForLLM(limit = 20): Promise<
  readonly MessageForLLM[]
> {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { role: true, content: true },
  })
  return messages.reverse().map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }))
}
