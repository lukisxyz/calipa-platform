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

export const eventTypes = sqliteTable("event_types", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.walletAddress),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  color: text("color").notNull().default("#000000"),
  location: text("location"),
  bookingUrl: text("booking_url"),
  bookingWindowStart: integer("booking_window_start"),
  bookingWindowEnd: integer("booking_window_end"),
  seatLimit: integer("seat_limit").default(1),
  requiresConfirmation: integer("requires_confirmation", {
    mode: "boolean",
  }).default(false),
  cancellationPolicy: text("cancellation_policy"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type EventType = typeof eventTypes.$inferSelect;
export type NewEventType = typeof eventTypes.$inferInsert;

export type AccountInput = Omit<
  Account,
  "createdAt" | "updatedAt" | "avatar"
> & { avatar?: string | null };

export type EventTypeInput = {
  id?: string;
  accountId: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
  location: string | null;
  bookingUrl: string | null;
  bookingWindowStart: number | null;
  bookingWindowEnd: number | null;
  seatLimit: number | null;
  requiresConfirmation: boolean | null;
  cancellationPolicy: string | null;
};
