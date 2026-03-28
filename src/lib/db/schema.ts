import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  walletAddress: text("wallet_address").primaryKey(),
  username: text("username").unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  timezone: text("timezone").notNull().default("UTC"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type AccountInput = Omit<
  Account,
  "createdAt" | "updatedAt" | "avatar"
> & { avatar?: string | null };
