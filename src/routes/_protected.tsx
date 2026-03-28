"use client"

import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router"
import { useInterwovenKit } from "@initia/interwovenkit-react"
import { ClientOnly } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

function shortenAddress(value: string) {
  if (value.length < 14) return value
  return `${value.slice(0, 8)}...${value.slice(-4)}`.toUpperCase()
}

function Header() {
  const { initiaAddress, openWallet } = useInterwovenKit()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" viewTransition className="flex items-center gap-2">
          <img src="/favicon-32x32.png" alt="Calipa" className="size-6" />
          <span className="text-xl font-black text-slate-800">Calipa</span>
        </Link>

        <div className="flex items-center gap-4">
          {initiaAddress && (
            <Button variant="outline" onClick={() => openWallet()}>
              {shortenAddress(initiaAddress)}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function ProtectedContent() {
  const { initiaAddress } = useInterwovenKit()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initiaAddress) {
      navigate({ to: "/login" })
    }
  }, [initiaAddress, navigate])

  if (!initiaAddress) {
    return null
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute("/_protected")({
  component: ProtectedPage,
})

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
  )
}
