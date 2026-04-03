import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";
import { useEventTypes, useEventTypeCount } from "@/queries/useEventTypes";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_protected/event-types/")({
  component: EventTypesPage,
});

function EventTypesPage() {
  const { initiaAddress } = useInterwovenKit();
  const navigate = useNavigate();
  const { data: eventTypes, isLoading } = useEventTypes(initiaAddress);
  const { data: count } = useEventTypeCount(initiaAddress);

  const canAddMore = (count ?? 0) < 3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Types</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your event types for booking
          </p>
        </div>
        {canAddMore && (
          <Button
            size="lg"
            className="rounded-lg"
            onClick={() => navigate({ to: "/event-types/create" })}
          >
            <Plus className="mr-1 size-4" />
            New Event Type
          </Button>
        )}
      </div>

      {!canAddMore && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            You have reached the maximum of 3 event types.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="text-slate-500">Loading...</div>
        </div>
      ) : eventTypes && eventTypes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((eventType) => (
            <Link
              key={eventType.id}
              to="/event-types/$eventTypeId"
              params={{ eventTypeId: eventType.id }}
              className="group block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: eventType.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">
                    {eventType.name}
                  </h3>
                  <p className="text-sm text-slate-500">/e/{eventType.slug}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                <span>{eventType.duration} min</span>
                {(eventType.seatLimit ?? 1) > 1 && (
                  <span>{eventType.seatLimit} guests</span>
                )}
                {eventType.priceType === "paid" && (
                  <span className="text-green-600 font-medium">
                    {(eventType.price || 0) / 1e6} USDC
                  </span>
                )}
                {eventType.priceType === "commitment" && (
                  <span className="text-amber-600 font-medium">Commitment</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">No event types yet</p>
          {canAddMore && (
            <Button
              variant="link"
              onClick={() => navigate({ to: "/event-types/create" })}
              className="mt-2 text-blue-600"
            >
              Create your first event type
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
