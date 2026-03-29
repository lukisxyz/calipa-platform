"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { shortenAddress } from "@/lib/helpers";

const menuItems = [
  {
    label: "Event Types",
    href: "/event-types",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M12 3v15" />
        <path d="M5.5 8.5l7 3.5-7 3.5z" />
        <path d="M18.5 12l-7 3.5 7 3.5z" />
      </svg>
    ),
  },
  {
    label: "Routing",
    href: "/routing",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v7" />
        <path d="M12 15v7" />
        <path d="M2 12h7" />
        <path d="M15 12h7" />
        <path d="M5.64 5.64l4.95 4.95" />
        <path d="M13.41 5.64l4.95 4.95" />
        <path d="M5.64 18.36l4.95-4.95" />
        <path d="M13.41 18.36l4.95-4.95" />
      </svg>
    ),
  },
  {
    label: "Insight",
    href: "/insight",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
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
                  {item.icon}
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
