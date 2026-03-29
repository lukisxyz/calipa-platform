import React from "react";
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRightIcon } from "lucide-react";

const routeLabels: Record<string, string> = {
  "event-types": "Event Types",
  create: "Create",
  edit: "Edit",
  bookings: "Bookings",
  workflows: "Workflows",
  routing: "Routing",
  insight: "Insight",
  account: "Account",
};

function ProtectedContent() {
  const { initiaAddress } = useInterwovenKit();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!initiaAddress) {
      navigate({ to: "/login" });
    }
  }, [initiaAddress, navigate]);

  const breadcrumbs = useMemo(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];

    if (pathParts[0] === "event-types") {
      crumbs.push({ label: "Event Types", path: "/event-types" });
      if (pathParts[1]) {
        if (pathParts[1] === "create") {
          crumbs.push({ label: "Create", path: "/event-types/create" });
        } else {
          crumbs.push({
            label: "Event Type",
            path: `/event-types/${pathParts[1]}`,
          });
          if (pathParts[2] === "edit") {
            crumbs.push({
              label: "Edit",
              path: `/event-types/${pathParts[1]}/edit`,
            });
          }
        }
      }
    } else if (routeLabels[pathParts[0]]) {
      crumbs.push({
        label: routeLabels[pathParts[0]],
        path: `/${pathParts[0]}`,
      });
    }

    return crumbs;
  }, [location.pathname]);

  if (!initiaAddress) {
    return null;
  }

  return (
    <div className="flex h-screen max-w-full overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main
          id="main-content"
          tabIndex={0}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          <div className="h-16 w-full mb-3.5 border-b flex items-center px-4">
            <Breadcrumb className="flex items-center gap-1">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-sm font-medium text-slate-900">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink
                          href={crumb.path}
                          className="text-sm text-slate-600 hover:text-slate-900"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                        <ChevronRightIcon className="size-3.5 text-slate-400 mb-1" />
                      </>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </Breadcrumb>
          </div>
          <div className="mx-auto max-w-7xl px-3.5 py-7">
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
