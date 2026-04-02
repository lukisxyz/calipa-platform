import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  walletAddress: text("wallet_address").primaryKey(),
  username: text("username").unique(),
  name: text("name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  bio: text("bio"),
  timezone: text("timezone").notNull().default("UTC"),
  role: text("role").notNull().default("user"), // "user" | "mentor"
  isMentorApproved: integer("is_mentor_approved", { mode: "boolean" }).default(
    false
  ),
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
  startTime: integer("start_time"),
  endTime: integer("end_time"),
  bufferTime: integer("buffer_time").default(0),
  seatLimit: integer("seat_limit").default(1),
  requiresConfirmation: integer("requires_confirmation", {
    mode: "boolean",
  }).default(false),
  cancellationPolicy: text("cancellation_policy"),
  // Price fields
  price: integer("price").default(0), // Price in USDC (smallest unit, 6 decimals)
  priceType: text("priceType", { length: 20 }).default("free"), // "free" | "paid" | "commitment"
  currency: text("currency", { length: 10 }).default("USDC"),
  tipEnabled: integer("tipEnabled", { mode: "boolean" }).default(false), // Enable tip for free events
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const bookings = sqliteTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    eventTypeId: text("event_type_id")
      .notNull()
      .references(() => eventTypes.id),
    hostAccountId: text("host_account_id")
      .notNull()
      .references(() => accounts.walletAddress),
    bookerName: text("booker_name").notNull(),
    bookerEmail: text("booker_email").notNull(),
    bookerTimezone: text("booker_timezone").notNull(),
    bookerWalletAddress: text("booker_wallet_address"),
    notes: text("notes"),
    startTime: integer("start_time", { mode: "timestamp" }).notNull(),
    endTime: integer("end_time", { mode: "timestamp" }).notNull(),
    status: text("status").notNull().default("pending"),
    cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
    cancellationReason: text("cancellation_reason"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    eventTypeIdIdx: index("bookings_event_type_id_idx").on(table.eventTypeId),
    hostAccountIdIdx: index("bookings_host_account_id_idx").on(
      table.hostAccountId
    ),
    startTimeIdx: index("bookings_start_time_idx").on(table.startTime),
    statusIdx: index("bookings_status_idx").on(table.status),
  })
);

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  paymentProvider: text("payment_provider"),
  paymentReference: text("payment_reference"),
  paymentType: text("payment_type", { length: 20 }), // "free" | "paid" | "commitment" | "tip"
  paidAt: integer("paid_at", { mode: "timestamp" }),
  refundedAt: integer("refunded_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type EventType = typeof eventTypes.$inferSelect;
export type NewEventType = typeof eventTypes.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Make all fields optional for input - server function handles defaults
export type AccountInput = Partial<Omit<Account, "createdAt" | "updatedAt">> & {
  walletAddress: string;
  name: string;
};

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
  startTime: number | null;
  endTime: number | null;
  bufferTime: number | null;
  seatLimit: number | null;
  requiresConfirmation: boolean | null;
  cancellationPolicy: string | null;
  // Price fields
  price: number | null;
  priceType: string | null;
  currency: string | null;
  tipEnabled: boolean | null;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type BookingInput = {
  eventTypeId: string;
  hostAccountId: string;
  bookerName: string;
  bookerEmail: string;
  bookerTimezone: string;
  bookerWalletAddress?: string | null;
  notes?: string | null;
  startTime: Date;
  endTime: Date;
  status?: BookingStatus;
};
