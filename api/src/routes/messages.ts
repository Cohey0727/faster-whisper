import { Hono } from "hono"
import { getRecentMessages } from "../services/messages.js"

export const messagesRoute = new Hono()

messagesRoute.get("/api/messages", async (c) => {
  try {
    const messages = await getRecentMessages()
    return c.json({ messages })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return c.json({ error: "Failed to fetch messages" }, 500)
  }
})
