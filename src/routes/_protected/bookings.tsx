import { createFileRoute } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { useAccount } from "@/queries/useAccount";
import { useBookingsByHost } from "@/queries/useBookings";
import { useConfirmBooking, useCancelBooking } from "@/queries/useBookings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import {
  Clock,
  User,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const { initiaAddress } = useInterwovenKit();
  const { data: account, isLoading: isLoadingAccount } =
    useAccount(initiaAddress);
  const { data: bookings, isLoading: isLoadingBookings } = useBookingsByHost(
    account?.walletAddress
  );
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const sortedBookings = useMemo(() => {
    if (!bookings) return [];

    return [...bookings].sort((a, b) => {
      // Pending first
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;

      // Then by date (newest first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  }, [bookings]);

  if (isLoadingAccount || isLoadingBookings) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Bookings</h1>
          <p className="text-slate-600">View all your scheduled bookings</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Bookings</h1>
        <p className="text-slate-600">View all your scheduled bookings</p>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <CalendarDays className="size-12 mx-auto mb-3 opacity-50" />
          <p>No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={() => setSelectedBooking(booking)}
            />
          ))}
        </div>
      )}

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}

function BookingCard({
  booking,
  onClick,
}: {
  booking: any;
  onClick: () => void;
}) {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
  };

  const status =
    statusConfig[booking.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
        status.bgColor,
        status.borderColor
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("size-4", status.color)} />
          <span className={cn("text-sm font-medium", status.color)}>
            {status.label}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          #{booking.id.slice(0, 8)}
        </span>
      </div>

      {booking.eventTypeName && (
        <div className="text-base font-semibold text-slate-900 mb-2">
          {booking.eventTypeName}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="size-4 text-slate-400" />
          <span className="text-sm font-medium">
            {format(new Date(booking.startTime), "MMM d, yyyy h:mm a")} -{" "}
            {format(new Date(booking.endTime), "h:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <User className="size-4 text-slate-400" />
          <span className="text-sm">{booking.bookerName}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Mail className="size-4 text-slate-400" />
          <span className="text-sm">{booking.bookerEmail}</span>
        </div>
      </div>

      {booking.notes && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-sm text-slate-600 line-clamp-2">{booking.notes}</p>
        </div>
      )}
    </div>
  );
}

function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: any;
  onClose: () => void;
}) {
  const confirmBooking = useConfirmBooking();
  const cancelBooking = useCancelBooking();
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (!booking) return null;

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
  };

  const status =
    statusConfig[booking.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  const handleConfirm = () => {
    confirmBooking.mutate({ id: booking.id });
    onClose();
  };

  const handleCancel = () => {
    if (showCancelReason) {
      cancelBooking.mutate({ id: booking.id, reason: cancelReason });
      onClose();
    } else {
      setShowCancelReason(true);
    }
  };

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Booking Details
          </DialogTitle>
          <DialogDescription>
            Booking ID: #{booking.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("size-5", status.color)} />
            <span className={cn("font-medium", status.color)}>
              {status.label}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Clock className="size-4 text-slate-400" />
              <span className="font-medium">Time</span>
            </div>
            <p className="text-slate-600 pl-6">
              {format(new Date(booking.startTime), "EEEE, MMMM d, yyyy h:mm a")}{" "}
              - {format(new Date(booking.endTime), "h:mm a")}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <User className="size-4 text-slate-400" />
              <span className="font-medium">Booker</span>
            </div>
            <p className="text-slate-600 pl-6">{booking.bookerName}</p>
            <p className="text-slate-500 pl-6 text-sm">{booking.bookerEmail}</p>
          </div>

          {booking.notes && (
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Mail className="size-4 text-slate-400" />
                <span className="font-medium">Notes</span>
              </div>
              <p className="text-slate-600 pl-6">{booking.notes}</p>
            </div>
          )}

          {showCancelReason && (
            <div className="border-t border-slate-200 pt-4">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Cancel reason (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {booking.status === "pending" && !confirmBooking.isPending && (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              <Check className="size-4" />
              Confirm
            </button>
          )}
          {booking.status === "pending" && !cancelBooking.isPending && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <X className="size-4" />
              {showCancelReason ? "Confirm Cancel" : "Cancel"}
            </button>
          )}
          {booking.status !== "pending" && booking.status !== "cancelled" && (
            <button
              onClick={handleCancel}
              disabled={cancelBooking.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <X className="size-4" />
              {cancelBooking.isPending ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
