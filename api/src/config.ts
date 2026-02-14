export interface AppConfig {
  readonly deepseekApiKey: string
  readonly whisperUrl: string
  readonly voicevoxUrl: string
  readonly databaseUrl: string
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

export function loadConfig(): AppConfig {
  return {
    deepseekApiKey: getRequiredEnv("DEEPSEEK_API_KEY"),
    whisperUrl: getOptionalEnv("WHISPER_URL", "http://localhost:8847"),
    voicevoxUrl: getOptionalEnv("VOICEVOX_URL", "http://localhost:50847"),
    databaseUrl: getOptionalEnv(
      "DATABASE_URL",
      "postgresql://postgres:postgres@localhost:5847/avatar",
    ),
  }
}
