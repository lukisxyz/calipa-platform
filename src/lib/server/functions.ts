import { createServerFn } from "@tanstack/react-start"
import { db } from "@/lib/db"
import { accounts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { Account, AccountInput } from "@/lib/db/schema"

export const getAccount = createServerFn({ method: "GET" })
  .inputValidator((data: { walletAddress: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get()

    if (!account) {
      throw new Error("Account not found")
    }

    return account as Account
  })

export const accountExists = createServerFn({ method: "GET" })
  .inputValidator((data: { walletAddress: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get()

    return !!account
  })

export const getAccountByUsername = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.username, data.username))
      .get()

    return account as Account | null
  })

export const createAccount = createServerFn({ method: "POST" })
  .inputValidator((data: AccountInput) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get()

    if (existing) {
      throw new Error("Account already exists")
    }

    const usernameExists = await db
      .select()
      .from(accounts)
      .where(eq(accounts.username, data.username))
      .get()

    if (usernameExists) {
      throw new Error("Username already taken")
    }

    const now = new Date()
    const result = await db
      .insert(accounts)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return result[0] as Account
  })
