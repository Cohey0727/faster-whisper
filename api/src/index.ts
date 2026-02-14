import { Hono } from "hono"
import { cors } from "hono/cors"
import { loadConfig } from "./config.js"
import { health } from "./routes/health.js"
import { createChatRoute } from "./routes/chat.js"
import { createTranscribeRoute } from "./routes/transcribe.js"
import { messagesRoute } from "./routes/messages.js"
import { createSpeakersRoute } from "./routes/speakers.js"

const config = loadConfig()
const app = new Hono()

app.use("/*", cors())
app.route("/", health)
app.route("/", createChatRoute(config))
app.route("/", createTranscribeRoute(config))
app.route("/", messagesRoute)
app.route("/", createSpeakersRoute(config))

export default {
  port: 3847,
  fetch: app.fetch,
}
