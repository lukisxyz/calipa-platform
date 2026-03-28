import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
})

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function GrainyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-white" />
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <filter id="sandFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="3"
            numOctaves="5"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sandFilter)" />
      </svg>
    </div>
  )
}

function DashboardPage() {
  return (
    <>
      <GrainyBackground />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 mb-8">
          Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-slate-500 mt-1">No bookings yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-slate-500 mt-1">
                No bookings this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-slate-500 mt-1">No revenue yet</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">No recent bookings</p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
