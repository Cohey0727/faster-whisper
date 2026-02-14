import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../prisma/generated/prisma/client.js"

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5847/avatar"

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })
