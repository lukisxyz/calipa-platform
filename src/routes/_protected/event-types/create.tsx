"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import * as v from "valibot";
import { useAccount } from "@/queries/useAccount";
import { useCreateEventType, useEventTypeCount } from "@/queries/useEventTypes";

const eventTypeSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Name is required"),
    v.maxLength(100, "Name must be at most 100 characters")
  ),
  slug: v.pipe(
    v.string(),
    v.minLength(3, "Slug must be at least 3 characters"),
    v.maxLength(60, "Slug must be at most 60 characters"),
    v.regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and dashes"
    )
  ),
  description: v.optional(v.string()),
  duration: v.pipe(v.number(), v.minValue(1)),
  color: v.pipe(v.string(), v.maxLength(7)),
  location: v.optional(v.string()),
  bookingUrl: v.optional(v.string()),
  bookingWindowStart: v.optional(v.number()),
  bookingWindowEnd: v.optional(v.number()),
  startTime: v.optional(v.number()),
  endTime: v.optional(v.number()),
  bufferTime: v.optional(v.number()),
  seatLimit: v.pipe(v.number(), v.minValue(1), v.maxValue(100)),
  requiresConfirmation: v.optional(v.boolean()),
  cancellationPolicy: v.optional(v.string()),
  // Price fields
  priceType: v.optional(v.string()),
  price: v.optional(v.number()),
  tipEnabled: v.optional(v.boolean()),
});

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const LOCATION_OPTIONS = [
  { value: "in-person", label: "In Person" },
  { value: "zoom", label: "Zoom" },
  { value: "google-meet", label: "Google Meet" },
  { value: "custom", label: "Custom Link" },
];

function generateTimeOptions() {
  const options = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    options.push({ value: minutes, label });
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

const BUFFER_TIME_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export const Route = createFileRoute("/_protected/event-types/create")({
  component: CreateEventTypePage,
});

function CreateEventTypePage() {
  const { initiaAddress } = useInterwovenKit();
  const navigate = useNavigate();
  const { data: account } = useAccount(initiaAddress);
  const { data: count } = useEventTypeCount(initiaAddress);
  const createEventType = useCreateEventType();
  const [error, setError] = useState<string | null>(null);

  const canAddMore = (count ?? 0) < 3;

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      duration: 30,
      color: "#000000",
      location: "",
      bookingUrl: "",
      bookingWindowStart: 0,
      bookingWindowEnd: 30,
      startTime: 540,
      endTime: 1020,
      bufferTime: 0,
      seatLimit: 1,
      requiresConfirmation: false,
      cancellationPolicy: "",
      // Price fields
      priceType: "free",
      price: 0,
      tipEnabled: false,
    },
    onSubmit: async ({ value }) => {
      if (!initiaAddress || !account) {
        setError("Account not found");
        return;
      }

      const result = v.safeParse(eventTypeSchema, value);
      if (!result.success) {
        setError(result.issues[0]?.message || "Validation failed");
        return;
      }

      setError(null);

      try {
        await createEventType.mutateAsync({
          accountId: initiaAddress,
          name: value.name,
          slug: value.slug,
          description: value.description || null,
          duration: value.duration,
          color: value.color,
          location: value.location || null,
          bookingUrl: value.bookingUrl || null,
          bookingWindowStart: value.bookingWindowStart ?? null,
          bookingWindowEnd: value.bookingWindowEnd ?? null,
          startTime: value.startTime ?? null,
          endTime: value.endTime ?? null,
          bufferTime: value.bufferTime ?? null,
          seatLimit: value.seatLimit,
          requiresConfirmation: value.requiresConfirmation ?? false,
          cancellationPolicy: value.cancellationPolicy || null,
          // Price fields
          priceType: value.priceType || "free",
          price: value.price ?? null,
          currency: "USDC",
          tipEnabled: value.tipEnabled ?? false,
        });

        navigate({ to: "/event-types", viewTransition: true });
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to create event type"
        );
      }
    },
  });

  const handleNameBlur = () => {
    const name = form.state.values.name;
    if (name) {
      const currentSlug = form.state.values.slug || "";
      const expectedSlug = generateSlug(name);
      if (!currentSlug || currentSlug === expectedSlug) {
        form.setFieldValue("slug", expectedSlug);
      }
    }
  };

  if (!canAddMore) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">
          Cannot Create Event Type
        </h1>
        <p className="mt-2 text-slate-600">
          You have reached the maximum of 3 event types per account.
        </p>
        <Button
          variant="link"
          onClick={() => navigate({ to: "/event-types" })}
          className="mt-4"
        >
          Back to Event Types
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Event Type</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set up a new event type for bookings
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
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
                  onBlur={handleNameBlur}
                  placeholder="30 Minute Meeting"
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
            name="slug"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">/e/</span>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="30-minute-meeting"
                    className="flex-1"
                  />
                </div>
                {field.state.meta.errors && (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="What is this meeting about?"
                  rows={3}
                />
              </div>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="duration"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Duration *</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />

            <form.Field
              name="color"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border border-input"
                    />
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="location"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Location</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select location</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />

            <form.Field
              name="bookingUrl"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Booking URL</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="https://..."
                    disabled={
                      field.state.value !== "" &&
                      form.state.values.location !== "custom"
                    }
                  />
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="bookingWindowStart"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    Booking Window Start (days)
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="0"
                  />
                </div>
              )}
            />

            <form.Field
              name="bookingWindowEnd"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Booking Window End (days)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="30"
                  />
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <form.Field
              name="startTime"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Working Hours Start</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />

            <form.Field
              name="endTime"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Working Hours End</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />

            <form.Field
              name="bufferTime"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Buffer Time</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {BUFFER_TIME_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="seatLimit"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Seat Limit</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    max={100}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="1"
                  />
                </div>
              )}
            />

            <form.Field
              name="requiresConfirmation"
              children={(field) => (
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="size-4"
                  />
                  <Label htmlFor={field.name} className="font-normal">
                    Requires confirmation
                  </Label>
                </div>
              )}
            />
          </div>

          <form.Field
            name="cancellationPolicy"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Cancellation Policy</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g., Free cancellation up to 24 hours before..."
                  rows={2}
                />
              </div>
            )}
          />

          {/* Price Type Section */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Event Type</Label>
              <form.Field
                name="priceType"
                children={(field) => (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => field.handleChange("free")}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        field.state.value === "free"
                          ? "border-slate-800 bg-slate-800 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => field.handleChange("paid")}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        field.state.value === "paid"
                          ? "border-slate-800 bg-slate-800 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => field.handleChange("commitment")}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        field.state.value === "commitment"
                          ? "border-slate-800 bg-slate-800 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Commitment
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Price input for paid events */}
            <form.Field
              name="price"
              children={(field) => (
                <div
                  className={`space-y-2 ${form.state.values.priceType !== "paid" ? "hidden" : ""}`}
                >
                  <Label htmlFor={field.name}>Price (USDC)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    step={0.01}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-slate-500">
                    Bookers will pay this amount in USDC when booking
                  </p>
                </div>
              )}
            />

            {/* Tip toggle for free events */}
            <form.Field
              name="tipEnabled"
              children={(field) => (
                <div
                  className={`flex items-center gap-2 ${form.state.values.priceType !== "free" ? "hidden" : ""}`}
                >
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="size-4"
                  />
                  <Label htmlFor={field.name} className="font-normal text-sm">
                    Allow tips/gratuity
                  </Label>
                  <p className="text-xs text-slate-500">
                    (optional payment from bookers)
                  </p>
                </div>
              )}
            />

            {/* Commitment fee explanation */}
            <div
              className={`text-sm text-slate-500 ${form.state.values.priceType !== "commitment" ? "hidden" : ""}`}
            >
              <p>
                <strong>Commitment Fee:</strong> Bookers will stake tokens as a
                deposit when booking. Set your mentor fee in the contract to
                configure the stake amount.
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/event-types" })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createEventType.isPending}
            >
              {createEventType.isPending ? "Creating..." : "Create Event Type"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
