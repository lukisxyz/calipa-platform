# ADR: Slot Availability Check for Booking System

## Status
Accepted

## Date
2026-04-03

## Context
When users book a time slot, the system needs to check if the slot has available capacity. Each event type has a `seatLimit` (default: 1) that defines the maximum number of bookings per session. If the quota is full, users should be warned before attempting to book.

## Decision
We implemented a dual-layer availability check:

### 1. Client-side (UI-level)
- Fetch existing bookings for the event type using `useBookingsByEventType`
- Calculate overlapping bookings for each time slot based on:
  - `seatLimit` from the event type
  - `requiresConfirmation` setting to determine conflict status
- Display fully booked slots with red styling and disable them
- Show a warning message when user tries to select an unavailable slot

### 2. Server-side (Submission-time)
- Keep the existing `checkSlotAvailability` server function
- Validate availability again on form submission to prevent race conditions
- Return error message with remaining seats if quota is exceeded

## Consequences

### Positive
- Users get immediate visual feedback when a slot is unavailable
- Reduces unnecessary form submissions for booked slots
- Server-side validation prevents race conditions
- Graceful fallback with clear error messages

### Negative
- Requires fetching all bookings for the event type (could be optimized with time-range query)
- Two potential failure points (UI check + server check)

## Technical Details

### Schema
```typescript
// eventTypes table has:
seatLimit: integer("seat_limit").default(1), // Max bookings per slot

// bookings table has:
status: text("status").notNull().default("pending"),
```

### Conflict Logic
- If `requiresConfirmation` is true: count `pending` and `confirmed` bookings
- If `requiresConfirmation` is false: count only `confirmed` bookings

### UI Behavior
- Available slots: Normal styling (border-slate-200)
- Selected slot: Dark styling (border-[#292929] bg-[#292929])
- Fully booked slot: Red styling (border-red-200 bg-red-50 text-red-400) with disabled state

## References
- Related PR: Slot availability check implementation
- Schema: `src/lib/db/schema.ts`
- Booking page: `src/routes/e.$username.$slug.tsx`
- Server function: `src/lib/server/functions.ts` (checkSlotAvailability)
