"use client";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEventTypeById } from "@/queries/useEventTypes";
import { useAccount } from "@/queries/useAccount";
import { useInterwovenKit } from "@initia/interwovenkit-react";

const DURATION_OPTIONS: Record<number, string> = {
  15: "15 minutes",
  30: "30 minutes",
  45: "45 minutes",
  60: "1 hour",
  90: "1.5 hours",
  120: "2 hours",
};

const LOCATION_LABELS: Record<string, string> = {
  "in-person": "In Person",
  zoom: "Zoom",
  "google-meet": "Google Meet",
  custom: "Custom Link",
};

function formatMinutesToTime(minutes: number | null): string {
  if (minutes === null || minutes === undefined) return "Not set";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
}

export const Route = createFileRoute("/_protected/event-types/$eventTypeId/")({
  component: EventTypeDetailPage,
});

function EventTypeDetailPage() {
  const { eventTypeId } = Route.useParams();
  const navigate = useNavigate();
  const { initiaAddress } = useInterwovenKit();
  const { data: account } = useAccount(initiaAddress);
  const { data: eventType, isLoading } = useEventTypeById(eventTypeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">
          Event Type Not Found
        </h1>
        <p className="mt-2 text-slate-600">
          The event type you're looking for doesn't exist.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {eventType.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">/e/{eventType.slug}</p>
        </div>
        <Button
          onClick={() =>
            navigate({
              to: "/event-types/$eventTypeId/edit",
              params: { eventTypeId },
            })
          }
        >
          Edit
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="size-12 rounded-full"
            style={{ backgroundColor: eventType.color }}
          />
          <div>
            <p className="font-medium text-slate-900">{eventType.name}</p>
            <p className="text-sm text-slate-500">
              {DURATION_OPTIONS[eventType.duration] ||
                `${eventType.duration} minutes`}
            </p>
          </div>
        </div>

        {eventType.description && (
          <div>
            <h3 className="text-sm font-medium text-slate-700">Description</h3>
            <p className="mt-1 text-sm text-slate-600">
              {eventType.description}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-700">Duration</h3>
            <p className="mt-1 text-sm text-slate-600">
              {DURATION_OPTIONS[eventType.duration] ||
                `${eventType.duration} minutes`}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Color</h3>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="size-5 rounded border border-slate-300"
                style={{ backgroundColor: eventType.color }}
              />
              <span className="text-sm text-slate-600">{eventType.color}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Location</h3>
            <p className="mt-1 text-sm text-slate-600">
              {LOCATION_LABELS[eventType.location ?? ""] ||
                eventType.location ||
                "Not set"}
            </p>
          </div>

          {eventType.location === "custom" && eventType.bookingUrl && (
            <div>
              <h3 className="text-sm font-medium text-slate-700">
                Booking URL
              </h3>
              <a
                href={eventType.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-blue-600 hover:underline"
              >
                {eventType.bookingUrl}
              </a>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-slate-700">Seat Limit</h3>
            <p className="mt-1 text-sm text-slate-600">{eventType.seatLimit}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">
              Requires Confirmation
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {eventType.requiresConfirmation ? "Yes" : "No"}
            </p>
          </div>

          {eventType.bookingWindowStart !== null &&
            eventType.bookingWindowStart !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  Booking Window Start
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {eventType.bookingWindowStart} days in advance
                </p>
              </div>
            )}

          {eventType.bookingWindowEnd !== null &&
            eventType.bookingWindowEnd !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  Booking Window End
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {eventType.bookingWindowEnd} days before
                </p>
              </div>
            )}

          <div>
            <h3 className="text-sm font-medium text-slate-700">
              Working Hours Start
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {formatMinutesToTime(eventType.startTime)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">
              Working Hours End
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {formatMinutesToTime(eventType.endTime)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Buffer Time</h3>
            <p className="mt-1 text-sm text-slate-600">
              {eventType.bufferTime
                ? `${eventType.bufferTime} minutes`
                : "None"}
            </p>
          </div>
        </div>

        {eventType.cancellationPolicy && (
          <div>
            <h3 className="text-sm font-medium text-slate-700">
              Cancellation Policy
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {eventType.cancellationPolicy}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-col">
        {account?.username && (
          <Link
            to="/e/$username/$slug"
            params={{ username: account.username, slug: eventType.slug }}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8"
          >
            View Public Page
          </Link>
        )}
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/event-types" })}
        >
          Back to Event Types
        </Button>
      </div>
    </div>
  );
}
