import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { accounts, eventTypes, bookings } from "@/lib/db/schema";
import { eq, and, count, lt, gt } from "drizzle-orm";
import type {
  Account,
  AccountInput,
  EventType,
  Booking,
  BookingInput,
} from "@/lib/db/schema";
import { randomUUID } from "crypto";
import { RESTClient } from "@initia/initia.js";

const INITIA_TESTNET_REST = "https://rest.testnet.initia.xyz";

export const getBalance = createServerFn({ method: "GET" })
  .inputValidator((data: { address: string }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await fetch(
        `${INITIA_TESTNET_REST}/cosmos/bank/v1beta1/balances/${data.address}`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.warn("Failed to get balance:", error);
      return { balances: [], pagination: { next_key: null } };
    }
  });

export const resolveUsername = createServerFn({ method: "GET" })
  .inputValidator((data: { address: string }) => data)
  .handler(async ({ data }) => {
    try {
      const rest = new RESTClient(INITIA_TESTNET_REST, {
        chainId: "initiation-2",
      });

      const address = data.address.startsWith("0x")
        ? data.address
        : data.address;

      const response = await rest.move.viewJSON(
        address,
        "usernames",
        "get_name_from_address",
        [],
        [`"${address}"`]
      );

      const parsed = JSON.parse(response.data);
      return { name: parsed.name || null };
    } catch (error) {
      console.warn("Failed to resolve username:", error);
      return { name: null };
    }
  });

export const getAccount = createServerFn({ method: "GET" })
  .inputValidator((data: { walletAddress: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get();

    if (!account) {
      throw new Error("Account not found");
    }

    return account as Account;
  });

export const accountExists = createServerFn({ method: "GET" })
  .inputValidator((data: { walletAddress: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get();

    return !!account;
  });

export const getAccountByUsername = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.username, data.username))
      .get();

    return account as Account | null;
  });

export const createAccount = createServerFn({ method: "POST" })
  .inputValidator((data: AccountInput) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get();

    if (existing) {
      throw new Error("Account already exists");
    }

    if (data.username) {
      const usernameExists = await db
        .select()
        .from(accounts)
        .where(eq(accounts.username, data.username))
        .get();

      if (usernameExists) {
        throw new Error("Username already taken");
      }
    }

    const now = new Date();
    const result = await db
      .insert(accounts)
      .values({
        ...data,
        role: data.role || "user",
        isMentorApproved: data.isMentorApproved ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0] as Account;
  });

export const updateAccount = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { walletAddress: string } & Partial<AccountInput>) => data
  )
  .handler(async ({ data }) => {
    const walletAddress = data.walletAddress;
    const updates = data as Partial<AccountInput>;

    const existing = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, walletAddress))
      .get();

    if (!existing) {
      throw new Error("Account not found");
    }

    if (updates.username && updates.username !== existing.username) {
      const usernameCheck = await db
        .select()
        .from(accounts)
        .where(eq(accounts.username, updates.username))
        .get();

      if (usernameCheck) {
        throw new Error("Username already taken");
      }
    }

    const now = new Date();
    const result = await db
      .update(accounts)
      .set({ ...updates, updatedAt: now })
      .where(eq(accounts.walletAddress, walletAddress))
      .returning();

    return result[0] as Account;
  });

export const checkIsMentor = createServerFn({ method: "GET" })
  .inputValidator((data: { walletAddress: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.walletAddress, data.walletAddress))
      .get();

    if (!account) {
      return { isMentor: false, hasUsername: false };
    }

    return {
      isMentor: account.role === "mentor",
      hasUsername: !!account.username,
    };
  });

export type EventTypeInput = Omit<EventType, "id" | "createdAt" | "updatedAt">;

export const getEventTypes = createServerFn({ method: "GET" })
  .inputValidator((data: { accountId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.accountId, data.accountId));

    return result as EventType[];
  });

export const getEventTypeById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.id, data.id))
      .get();

    return result as EventType | null;
  });

export const getEventTypeBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { accountId: string; slug: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(eventTypes)
      .where(
        and(
          eq(eventTypes.accountId, data.accountId),
          eq(eventTypes.slug, data.slug)
        )
      )
      .get();

    return result as EventType | null;
  });

export const getEventTypeByUsernameAndSlug = createServerFn({ method: "GET" })
  .inputValidator((data: { username: string; slug: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.username, data.username))
      .get();

    if (!account) {
      return null;
    }

    const eventType = await db
      .select()
      .from(eventTypes)
      .where(
        and(
          eq(eventTypes.accountId, account.walletAddress),
          eq(eventTypes.slug, data.slug)
        )
      )
      .get();

    return eventType as EventType | null;
  });

export const getEventTypeCount = createServerFn({ method: "GET" })
  .inputValidator((data: { accountId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: count() })
      .from(eventTypes)
      .where(eq(eventTypes.accountId, data.accountId));

    return result[0]?.count ?? 0;
  });

export const slugExists = createServerFn({ method: "GET" })
  .inputValidator((data: { accountId: string; slug: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(eventTypes)
      .where(
        and(
          eq(eventTypes.accountId, data.accountId),
          eq(eventTypes.slug, data.slug)
        )
      )
      .get();

    return !!result;
  });

export const createEventType = createServerFn({ method: "POST" })
  .inputValidator((data: EventTypeInput) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(eventTypes)
      .where(
        and(
          eq(eventTypes.accountId, data.accountId),
          eq(eventTypes.slug, data.slug)
        )
      )
      .get();

    if (existing) {
      throw new Error("Event type with this slug already exists");
    }

    const countResult = await db
      .select({ count: count() })
      .from(eventTypes)
      .where(eq(eventTypes.accountId, data.accountId));

    if ((countResult[0]?.count ?? 0) >= 3) {
      throw new Error("Maximum of 3 event types allowed per account");
    }

    const now = new Date();
    const result = await db
      .insert(eventTypes)
      .values({
        ...data,
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0] as EventType;
  });

export const updateEventType = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & Partial<EventTypeInput>) => data)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;

    const existing = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.id, id))
      .get();

    if (!existing) {
      throw new Error("Event type not found");
    }

    if (updates.slug && updates.slug !== existing.slug) {
      const slugCheck = await db
        .select()
        .from(eventTypes)
        .where(
          and(
            eq(eventTypes.accountId, existing.accountId),
            eq(eventTypes.slug, updates.slug)
          )
        )
        .get();

      if (slugCheck) {
        throw new Error("Event type with this slug already exists");
      }
    }

    const now = new Date();
    const result = await db
      .update(eventTypes)
      .set({ ...updates, updatedAt: now })
      .where(eq(eventTypes.id, id))
      .returning();

    return result[0] as EventType;
  });

export const deleteEventType = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.id, data.id))
      .get();

    if (!existing) {
      throw new Error("Event type not found");
    }

    await db.delete(eventTypes).where(eq(eventTypes.id, data.id)).run();

    return { success: true };
  });

export type BookingWithEventType = Booking & {
  eventTypeName: string | null;
};

export const getBookingsByHost = createServerFn({ method: "GET" })
  .inputValidator((data: { hostAccountId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(bookings)
      .leftJoin(eventTypes, eq(bookings.eventTypeId, eventTypes.id))
      .where(eq(bookings.hostAccountId, data.hostAccountId))
      .orderBy(bookings.startTime);

    return result.map((row) => ({
      ...row.bookings,
      eventTypeName: row.event_types?.name ?? null,
    })) as BookingWithEventType[];
  });

export const getBookingsByEventType = createServerFn({ method: "GET" })
  .inputValidator((data: { eventTypeId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.eventTypeId, data.eventTypeId))
      .orderBy(bookings.startTime);

    return result as Booking[];
  });

export const getBookingById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, data.id))
      .get();

    return result as Booking | null;
  });

export const checkSlotAvailability = createServerFn({ method: "GET" })
  .inputValidator(
    (data: { eventTypeId: string; startTime: Date; endTime: Date }) => data
  )
  .handler(async ({ data }) => {
    const eventType = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.id, data.eventTypeId))
      .get();

    if (!eventType) {
      throw new Error("Event type not found");
    }

    const conflictType = eventType.requiresConfirmation
      ? "pending"
      : "confirmed";
    const bufferTime = eventType.bufferTime ?? 0;

    const effectiveEndTime = new Date(
      data.endTime.getTime() + bufferTime * 60 * 1000
    );

    const overlappingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.eventTypeId, data.eventTypeId),
          eq(bookings.status, conflictType),
          lt(bookings.startTime, effectiveEndTime),
          gt(bookings.endTime, data.startTime)
        )
      );

    const seatLimit = eventType.seatLimit ?? 1;
    const available = overlappingBookings.length < seatLimit;
    const seatsRemaining = Math.max(0, seatLimit - overlappingBookings.length);

    return { available, seatsRemaining, seatLimit };
  });

export const getAccountByEmail = createServerFn({ method: "GET" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.email, data.email))
      .get();

    return account as Account | null;
  });

export const createOrUpdateAccountFromBooking = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: {
      walletAddress?: string | null;
      name: string;
      email: string;
      timezone: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const { walletAddress, name, email, timezone } = data;

    if (walletAddress) {
      const existingByWallet = await db
        .select()
        .from(accounts)
        .where(eq(accounts.walletAddress, walletAddress))
        .get();

      if (existingByWallet) {
        const now = new Date();
        const result = await db
          .update(accounts)
          .set({
            name,
            email,
            timezone,
            updatedAt: now,
          })
          .where(eq(accounts.walletAddress, walletAddress))
          .returning();

        return result[0] as Account;
      }
    }

    if (email) {
      const existingByEmail = await db
        .select()
        .from(accounts)
        .where(eq(accounts.email, email))
        .get();

      if (existingByEmail) {
        const now = new Date();

        const updateFields: Record<string, unknown> = {
          name,
          timezone,
          updatedAt: now,
        };

        if (!walletAddress && !existingByEmail.walletAddress) {
          updateFields.email = email;
        }
        if (walletAddress && !existingByEmail.walletAddress) {
          updateFields.walletAddress = walletAddress;
        }

        const result = await db
          .update(accounts)
          .set(updateFields)
          .where(eq(accounts.email, email))
          .returning();

        return result[0] as Account;
      }
    }

    const now = new Date();
    const result = await db
      .insert(accounts)
      .values({
        walletAddress: walletAddress || `guest_${randomUUID()}`,
        username: null,
        name,
        email,
        timezone,
        role: "user",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0] as Account;
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingInput) => data)
  .handler(async ({ data }) => {
    const eventType = await db
      .select()
      .from(eventTypes)
      .where(eq(eventTypes.id, data.eventTypeId))
      .get();

    if (!eventType) {
      throw new Error("Event type not found");
    }

    const conflictType = eventType.requiresConfirmation
      ? "pending"
      : "confirmed";
    const bufferTime = eventType.bufferTime ?? 0;

    const effectiveEndTime = new Date(
      data.endTime.getTime() + bufferTime * 60 * 1000
    );

    const overlappingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.eventTypeId, data.eventTypeId),
          eq(bookings.status, conflictType),
          lt(bookings.startTime, effectiveEndTime),
          gt(bookings.endTime, data.startTime)
        )
      );

    const seatLimit = eventType.seatLimit ?? 1;
    if (overlappingBookings.length >= seatLimit) {
      throw new Error("This time slot is no longer available");
    }

    const status = eventType.requiresConfirmation ? "pending" : "confirmed";
    const now = new Date();

    const result = await db
      .insert(bookings)
      .values({
        ...data,
        id: randomUUID(),
        status,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return result[0] as Booking;
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; reason?: string }) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, data.id))
      .get();

    if (!existing) {
      throw new Error("Booking not found");
    }

    if (existing.status === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    const now = new Date();
    const result = await db
      .update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: now,
        cancellationReason: data.reason ?? null,
        updatedAt: now,
      })
      .where(eq(bookings.id, data.id))
      .returning();

    return result[0] as Booking;
  });

export const confirmBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, data.id))
      .get();

    if (!existing) {
      throw new Error("Booking not found");
    }

    if (existing.status !== "pending") {
      throw new Error("Only pending bookings can be confirmed");
    }

    const now = new Date();
    const result = await db
      .update(bookings)
      .set({
        status: "confirmed",
        updatedAt: now,
      })
      .where(eq(bookings.id, data.id))
      .returning();

    return result[0] as Booking;
  });
