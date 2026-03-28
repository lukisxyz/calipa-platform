"use client"

import { ClientOnly, createFileRoute } from "@tanstack/react-router"
import { useInterwovenKit } from "@initia/interwovenkit-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"

const getStoredAccount = (address: string) => {
  if (typeof window === "undefined") return null
  const accounts = localStorage.getItem("calipa_accounts")
  if (!accounts) return null
  const parsed = JSON.parse(accounts)
  return parsed[address] || null
}

function shortenAddress(value: string) {
  if (value.length < 14) return value
  return `${value.slice(0, 8)}...${value.slice(-4)}`
}

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

function LoginContent() {
  const { initiaAddress, openConnect, openWallet } = useInterwovenKit()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initiaAddress) return

    const checkAccount = () => {
      const account = getStoredAccount(initiaAddress)
      if (account) {
        navigate({ to: "/dashboard", viewTransition: true })
      } else {
        navigate({ to: "/create-account", viewTransition: true })
      }
    }

    checkAccount()
  }, [initiaAddress, navigate])

  const handleConnect = () => {
    openConnect()
  }

  const handleDisconnect = () => {
    openWallet()
  }

  return (
    <>
      <GrainyBackground />
      <main className="flex min-h-svh flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your bookings
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Crypto Deposits
                    </p>
                    <p className="text-xs text-slate-500">
                      Secure your bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Instant Payments
                    </p>
                    <p className="text-xs text-slate-500">Get paid in crypto</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Calendar Sync
                    </p>
                    <p className="text-xs text-slate-500">
                      Never miss a booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {initiaAddress ? (
                <Button
                  onClick={handleDisconnect}
                  className="w-full py-6 text-base font-semibold"
                >
                  {shortenAddress(initiaAddress)}
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  className="w-full py-6 text-base font-semibold"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            By connecting, you agree to our Terms of Service
          </p>
        </div>
      </main>
    </>
  )
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500">Loading wallet...</div>
        </div>
      }
    >
      <LoginContent />
    </ClientOnly>
  )
}
