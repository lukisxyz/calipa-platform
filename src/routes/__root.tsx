import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import { Providers } from "../providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title:
          "Calipa - Blockchain Scheduling & Booking App | Secure Crypto Payments & No-Show Protection",
      },
      {
        name: "description",
        content:
          "Create your Calipa booking page in minutes. Accept crypto payments, require blockchain deposits to prevent no-shows, sync calendars, and get paid instantly. The secure Calendly alternative for Web3.",
      },
      {
        name: "keywords",
        content:
          "blockchain scheduling app, crypto booking calendar, no-show protection booking, decentralized Calendly alternative, Web3 payment scheduler, secure blockchain meeting scheduler with deposits",
      },
      {
        property: "og:title",
        content:
          "Calipa - Blockchain Scheduling & Booking App | Secure Crypto Payments & No-Show Protection",
      },
      {
        property: "og:description",
        content:
          "Create your Calipa booking page in minutes. Accept crypto payments, require blockchain deposits to prevent no-shows, sync calendars, and get paid instantly.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Calipa - Blockchain Scheduling & Booking App",
      },
      {
        name: "twitter:description",
        content:
          "The secure Calendly alternative for Web3 with no-show protection via crypto deposits.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-svh bg-white antialiased">
        <Providers>
          <Outlet />
        </Providers>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
