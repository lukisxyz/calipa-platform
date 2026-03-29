import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

function ProtectedContent() {
  const { initiaAddress } = useInterwovenKit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initiaAddress) {
      navigate({ to: "/login" });
    }
  }, [initiaAddress, navigate]);

  if (!initiaAddress) {
    return null;
  }

  return (
    <div className="flex h-screen max-w-full overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_protected")({
  component: ProtectedPage,
});

function ProtectedPage() {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      }
    >
      <ProtectedContent />
    </ClientOnly>
  );
}
