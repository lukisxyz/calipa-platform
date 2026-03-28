import { createFileRoute } from "@tanstack/react-router"
import { useInterwovenKit } from "@initia/interwovenkit-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount } from "@/queries/useAccount"

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  const { initiaAddress } = useInterwovenKit()
  const { data: account, isLoading } = useAccount(initiaAddress)

  if (isLoading || !account) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-800">
        Dashboard
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Username</p>
              <p className="text-lg font-semibold">@{account.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Name</p>
              <p className="text-lg">{account.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-lg">{account.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Timezone</p>
              <p className="text-lg">{account.timezone}</p>
            </div>
            {account.bio && (
              <div>
                <p className="text-sm font-medium text-slate-500">Bio</p>
                <p className="text-lg">{account.bio}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-500">Wallet</p>
              <p className="text-sm font-mono text-slate-600">
                {account.walletAddress}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-sm text-slate-500">No bookings yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-sm text-slate-500">
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
            <p className="mt-1 text-sm text-slate-500">No revenue yet</p>
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
    </>
  )
}
