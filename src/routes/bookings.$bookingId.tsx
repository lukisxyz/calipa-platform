import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useBookingById } from "@/queries/useBookings";
import { useAccount } from "@/queries/useAccount";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ticket,
  QrCode,
  User,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingReceiptPage,
});

function BookingReceiptPage() {
  const { bookingId } = Route.useParams();
  const { data: booking, isLoading } = useBookingById(bookingId);
  const { data: hostAccount } = useAccount(booking?.hostAccountId);
  const navigate = useNavigate();
  const [showQr, setShowQr] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-400 animate-pulse">
          Loading your ticket...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Ticket className="size-16 mx-auto text-stone-300 mb-4" />
          <h1 className="text-2xl font-bold text-stone-700">
            Ticket not found
          </h1>
          <p className="mt-2 text-stone-500">This booking does not exist.</p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="mt-4 bg-stone-600 hover:bg-stone-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: AlertCircle,
      color: "text-slate-500",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
      accentColor: "#64748b",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
      accentColor: "#475569",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-slate-400",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      accentColor: "#94a3b8",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
      accentColor: "#475569",
    },
  };

  const status =
    statusConfig[booking.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;
  const ticketNumber = booking.id.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="relative mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        {/* Main Ticket Card */}
        <div className="relative">
          {/* Perforated line - top */}
          <div className="absolute top-0 left-8 right-8 h-px border-t-2 border-dotted border-stone-300" />

          {/* Perforated line - bottom */}
          <div className="absolute bottom-0 left-8 right-8 h-px border-b-2 border-dotted border-stone-300" />

          {/* Ticket Card */}
          <div className="relative bg-white rounded-2xl border-2 border-stone-500 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-stone-500 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-stone-300 flex items-center justify-center">
                    <Ticket className="size-6 text-stone-700" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-widest">
                      Event Pass
                    </p>
                    <h1 className="text-2xl font-bold text-stone-800">
                      {hostAccount?.name || "Event"}
                    </h1>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-stone-100 border border-stone-200">
                  <StatusIcon className={cn("size-4", status.color)} />
                  <span className={cn("text-sm font-medium", status.color)}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section - Event Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-stone-500">
                        <Calendar className="size-4" />
                        <span className="text-xs uppercase tracking-wider">
                          Date
                        </span>
                      </div>
                      <p className="text-lg font-medium text-stone-800">
                        {format(
                          new Date(booking.startTime),
                          "EEE, MMM d, yyyy"
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-stone-500">
                        <Clock className="size-4" />
                        <span className="text-xs uppercase tracking-wider">
                          Time
                        </span>
                      </div>
                      <p className="text-lg font-medium text-stone-800">
                        {format(new Date(booking.startTime), "h:mm a")} -{" "}
                        {format(new Date(booking.endTime), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-stone-200" />

                  {/* Attendee Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-stone-500">
                      <User className="size-4" />
                      <span className="text-xs uppercase tracking-wider">
                        Attendee
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-stone-300 flex items-center justify-center text-xl font-medium text-stone-700">
                        {booking.bookerName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xl font-medium text-stone-800">
                          {booking.bookerName}
                        </p>
                        <p className="text-sm text-stone-500">
                          {booking.bookerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <>
                      <div className="h-px bg-stone-200" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                          <MapPin className="size-4" />
                          <span className="text-xs uppercase tracking-wider">
                            Notes
                          </span>
                        </div>
                        <p className="text-stone-600">{booking.notes}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Section - QR & Ticket Number */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <div className="text-center space-y-4 w-full">
                    <div className="text-xs text-stone-500 uppercase tracking-widest">
                      Ticket Code
                    </div>
                    <div className="text-3xl font-mono font-medium text-stone-800 tracking-widest">
                      {ticketNumber}
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <button
                    onClick={() => setShowQr(!showQr)}
                    className="mt-6 relative group cursor-pointer"
                  >
                    <div className="size-32 bg-white rounded-lg p-2 transition-transform group-hover:scale-105 border border-stone-200">
                      <div className="w-full h-full bg-white rounded overflow-hidden">
                        <QrCode className="w-full h-full text-stone-800" />
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Tap to reveal
                    </div>
                  </button>

                  {/* Show full QR when tapped */}
                  {showQr && (
                    <div className="mt-12 p-4 bg-white rounded-lg border border-stone-200">
                      <QrCode className="size-40 text-stone-800" />
                      <p className="text-xs text-stone-500 mt-2 font-mono text-center">
                        {booking.id}
                      </p>
                    </div>
                  )}

                  {/* Wallet Address */}
                  {booking.bookerWalletAddress && (
                    <div className="mt-auto pt-6 w-full">
                      <div className="text-xs text-stone-500 uppercase tracking-widest text-center mb-2">
                        Wallet
                      </div>
                      <p className="text-xs font-mono text-stone-600 bg-stone-100 rounded-lg px-3 py-2 text-center break-all">
                        {booking.bookerWalletAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Strip */}
            <div className="px-8 py-4 border-t border-stone-500 bg-white">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <Globe className="size-3" />
                  <span>{booking.bookerTimezone}</span>
                </div>
                <p>Booking ID: {booking.id}</p>
              </div>
            </div>
          </div>

          {/* Ticket Stub Indicators (Left side) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="size-4 bg-white rounded-full border border-stone-500" />
            <div className="size-4 bg-white rounded-full border border-stone-500 mt-12" />
          </div>

          {/* Ticket Stub Indicators (Right side) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <div className="size-4 bg-white rounded-full border border-stone-500" />
            <div className="size-4 bg-white rounded-full border border-stone-500 mt-12" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            className="border-stone-300 text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
