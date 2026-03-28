import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle>

const tursoUrl = process.env.TURSO_DATABASE_URL

if (tursoUrl) {
  const client = createClient({
    url: tursoUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  db = drizzle(client, { schema })
} else {
  const sqlite = new Database("calipa.db")
  db = drizzle(sqlite, { schema })
}

export { db }

export type DB = typeof db
