"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEventTypeByUsernameAndSlug } from "@/queries/useEventTypes";
import { useAccountByUsername } from "@/queries/useAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import * as v from "valibot";
import { cn } from "@/lib/utils";
import { addDays, isBefore, startOfDay } from "date-fns";
import {
  Check,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Wallet,
  LogOut,
} from "lucide-react";
import { useInterwovenKit } from "@initia/interwovenkit-react";

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
  timezone: v.pipe(v.string(), v.minLength(1, "Timezone is required")),
  walletAddress: v.optional(v.string()),
  notes: v.optional(v.string()),
  date: v.pipe(v.string(), v.minLength(1, "Please select a date")),
});

function getTimeSlots(
  startTime: number | null,
  endTime: number | null,
  duration: number,
  bufferTime: number
): string[] {
  const start = startTime ?? 540;
  const end = endTime ?? 1020;

  const slots: string[] = [];

  let currentTime = Math.ceil(start / 30) * 30;

  while (currentTime + duration + bufferTime <= end) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    );
    currentTime += 30;
  }

  return slots;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function Header() {
  const { address, openConnect, disconnect, isConnected } = useInterwovenKit();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-7">
      <div className="text-xl font-bold text-slate-900">
        <Link to="/" viewTransition className="flex items-center gap-2 px-2">
          <img src="/favicon-32x32.png" alt="Calipa" className="size-6" />
          <span className="text-xl font-black text-slate-800">Calipa</span>
        </Link>
      </div>
      <div>
        {isConnected && address ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-slate-600">
              {truncateAddress(address)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="flex items-center gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="size-4" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={() => openConnect()}>Connect Wallet</Button>
        )}
      </div>
    </header>
  );
}

function BookingPage() {
  const { username, slug } = Route.useParams();
  const { data: eventType, isLoading: eventTypeLoading } =
    useEventTypeByUsernameAndSlug(username, slug);
  const { data: account, isLoading: accountLoading } =
    useAccountByUsername(username);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      walletAddress: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      const result = v.safeParse(bookingSchema, {
        ...value,
        date: selectedDate?.toISOString() || "",
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
      setShowModal(false);
    },
  });

  if (accountLoading || eventTypeLoading) {
    return (
      <>
        <Header />
        <div className="flex h-screen items-center justify-center pt-16">
          <div className="text-slate-500">Loading...</div>
        </div>
      </>
    );
  }

  if (!eventType || !account) {
    return (
      <>
        <Header />
        <div className="flex h-screen items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Event not found
            </h1>
            <p className="mt-2 text-slate-500">
              This event type does not exist or has been removed.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="flex h-screen items-center justify-center px-4 pt-16">
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
      </>
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

  const timeSlots = getTimeSlots(
    eventType.startTime,
    eventType.endTime,
    eventType.duration,
    eventType.bufferTime ?? 0
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen overflow-hidden bg-[#f5f5f5] p-3.5 flex justify-center pt-32 pb-4">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-3 md:grid-cols-3">
            {/* Event Information */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm overflow-auto">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                {eventType.name}
              </h2>
              <div className="space-y-2.5">
                <div>
                  {eventType.description && (
                    <p className="py-2 text-sm text-slate-500">
                      {eventType.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-sm text-slate-500">Host</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">
                      {account.name}
                    </div>
                    <div className="text-xs text-slate-400">@{username}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 py-2.5">
                  <span className="text-sm text-slate-500">Duration</span>
                  <span className="text-sm font-medium text-slate-900">
                    {eventType.duration} min
                  </span>
                </div>
                {locationText && (
                  <div className="flex items-center justify-between border-b border-slate-100 py-2.5">
                    <span className="text-sm text-slate-500">Location</span>
                    <span className="text-sm font-medium text-slate-900">
                      {locationText}
                    </span>
                  </div>
                )}
                {eventType.bookingWindowStart !== undefined &&
                  eventType!.bookingWindowStart! > 0 && (
                    <div className="flex items-center justify-between border-b border-slate-100 py-2.5">
                      <span className="text-sm text-slate-500">
                        Booking window
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        +{eventType.bookingWindowStart} days
                      </span>
                    </div>
                  )}
                {eventType.bookingWindowEnd !== undefined && (
                  <div className="flex items-center justify-between border-b border-slate-100 py-2.5">
                    <span className="text-sm text-slate-500">Book within</span>
                    <span className="text-sm font-medium text-slate-900">
                      {eventType.bookingWindowEnd} days
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-500">Confirmation</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      eventType.requiresConfirmation
                        ? "text-amber-600"
                        : "text-green-600"
                    )}
                  >
                    {eventType.requiresConfirmation ? "Required" : "Instant"}
                  </span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-120 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-slate-500" />
                  Select Date
                </span>
              </h2>
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => {
                  setSelectedDate(date || null);
                  setSelectedTime(null);
                }}
                fromDate={minDate}
                toDate={maxDate}
                disabled={(date) =>
                  isBefore(date, startOfDay(today)) ||
                  date.getDay() === 0 ||
                  date.getDay() === 6
                }
                className="rounded-md [--cell-size:2.5rem]"
              />
            </div>

            {/* Available Times */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm overflow-auto">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-slate-500" />
                  Select Time
                </span>
              </h2>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      disabled={selectedTime === time}
                      className={cn(
                        "rounded border px-2 py-1.5 text-sm font-medium transition-colors",
                        selectedTime === time
                          ? "border-[#292929] bg-[#292929] text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select a date first</p>
              )}
            </div>
          </div>

          {/* Booking Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Your Details</DialogTitle>
                <DialogDescription>
                  Please fill in your information to confirm the booking for{" "}
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-3"
              >
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Name *
                      </Label>
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
                    <div className="space-y-1">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Email *
                      </Label>
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
                  name="timezone"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        <span className="flex items-center gap-1">
                          <Globe className="size-3" />
                          Timezone *
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Your timezone"
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
                  name="walletAddress"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        <span className="flex items-center gap-1">
                          <Wallet className="size-3" />
                          Wallet Address (optional)
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="0x..."
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="notes"
                  children={(field) => (
                    <div className="space-y-1">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Additional notes
                      </Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Anything else..."
                        rows={2}
                      />
                    </div>
                  )}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {eventType.requiresConfirmation
                      ? "Request to Book"
                      : "Confirm Booking"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
