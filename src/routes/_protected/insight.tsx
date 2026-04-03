import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/insight")({
  component: InsightPage,
});

function InsightPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-900">Insight</h1>
      <p className="mt-2 text-slate-600">
        View your analytics and insights here.
      </p>
    </div>
  );
}
