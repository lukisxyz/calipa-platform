import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
      <p className="mt-2 text-slate-600">Manage your bookings here.</p>
    </div>
  );
}
