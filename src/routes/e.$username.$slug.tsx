"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEventTypeByUsernameAndSlug } from "@/queries/useEventTypes";
import { useAccountByUsername } from "@/queries/useAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import * as v from "valibot";
import { cn } from "@/lib/utils";
import { addDays, isBefore, startOfDay } from "date-fns";
import { Check } from "lucide-react";

export const Route = createFileRoute("/e/$username/$slug")({
  component: BookingPage,
});

const bookingSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Name is required"),
    v.maxLength(100)
  ),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  notes: v.optional(v.string()),
  date: v.pipe(v.string(), v.minLength(1, "Please select a date")),
});

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

function BookingPage() {
  const { username, slug } = Route.useParams();
  const { data: eventType, isLoading: eventTypeLoading } =
    useEventTypeByUsernameAndSlug(username, slug);
  const { data: account, isLoading: accountLoading } =
    useAccountByUsername(username);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      if (!selectedDate || !selectedTime) {
        setError("Please select a date and time");
        return;
      }

      const result = v.safeParse(bookingSchema, {
        ...value,
        date: selectedDate.toISOString(),
      });
      if (!result.success) {
        setError(result.issues[0]?.message || "Validation failed");
        return;
      }

      setError(null);
      console.log("Booking submitted:", {
        ...value,
        date: selectedDate,
        time: selectedTime,
        eventTypeId: eventType?.id,
      });
      setSuccess(true);
    },
  });

  if (accountLoading || eventTypeLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!eventType || !account) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Event not found</h1>
          <p className="mt-2 text-slate-500">
            This event type does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <Check className="size-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-slate-500">
            Your booking for {eventType.name} has been submitted.
            {eventType.requiresConfirmation &&
              " You'll receive a confirmation email."}
          </p>
        </div>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const minDate = eventType.bookingWindowStart
    ? addDays(today, eventType.bookingWindowStart)
    : today;
  const maxDate = eventType.bookingWindowEnd
    ? addDays(today, eventType.bookingWindowEnd)
    : addDays(today, 30);

  const locationText =
    eventType.location === "zoom"
      ? "Zoom"
      : eventType.location === "google-meet"
        ? "Google Meet"
        : eventType.location === "in-person"
          ? "In Person"
          : eventType.bookingUrl || "";

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: eventType.color }}
            />
            <span className="text-sm text-slate-500">
              {account.name} ({username})
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {eventType.name}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>{eventType.duration} min</span>
            {locationText && <span>{locationText}</span>}
          </div>
        </div>

        {eventType.description && (
          <p className="mb-8 text-center text-slate-600">
            {eventType.description}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Select Date
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => setSelectedDate(date || null)}
              fromDate={minDate}
              toDate={maxDate}
              disabled={(date) =>
                isBefore(date, startOfDay(today)) ||
                date.getDay() === 0 ||
                date.getDay() === 6
              }
              className="rounded-md"
            />
            <p className="mt-2 text-xs text-slate-500">
              Select a weekday within the booking window
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Select Time
            </h2>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm transition-colors",
                      selectedTime === time
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Please select a date first
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Your Details
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="name"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Name *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your name"
                  />
                  {field.state.meta.errors && (
                    <p className="text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="your@email.com"
                  />
                  {field.state.meta.errors && (
                    <p className="text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="notes"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Notes</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Any additional information..."
                    rows={3}
                  />
                </div>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold"
              disabled={!selectedDate || !selectedTime}
            >
              {eventType.requiresConfirmation
                ? "Request to Book"
                : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
