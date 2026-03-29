"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { shortenAddress } from "@/lib/helpers";
import {
  Calendar,
  CalendarDays,
  GitBranch,
  Share2,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  {
    label: "Event Types",
    href: "/event-types",
    icon: Calendar,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: GitBranch,
  },
  {
    label: "Routing",
    href: "/routing",
    icon: Share2,
  },
  {
    label: "Insight",
    href: "/insight",
    icon: TrendingUp,
  },
];

export function DashboardSidebar() {
  const { disconnect, initiaAddress, openWallet } = useInterwovenKit();
  const location = useLocation();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white py-3.5">
      <div className="px-4 pb-3.5 border-b">
        <Link to="/" viewTransition className="flex items-center gap-2 px-2">
          <img src="/favicon-32x32.png" alt="Calipa" className="size-6" />
          <span className="text-xl font-black text-slate-800">Calipa</span>
        </Link>
      </div>

      <nav className="my-7 flex-1">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  viewTransition
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 px-4 space-y-2 border-t pt-3.5">
        <Button
          onClick={() => openWallet()}
          size="lg"
          className="w-full rounded-lg"
          variant="outline"
        >
          {initiaAddress ? shortenAddress(initiaAddress) : "Loading ..."}
        </Button>
        <Button
          onClick={() => disconnect()}
          size="lg"
          className="w-full rounded-lg"
          variant="destructive"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
