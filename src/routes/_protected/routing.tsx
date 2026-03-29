import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/routing")({
  component: RoutingPage,
});

function RoutingPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-slate-900">Routing</h1>
      <p className="mt-2 text-slate-600">Configure your routing here.</p>
    </div>
  );
}
