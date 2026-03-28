import { useState, useEffect } from "react"
import { createClientOnlyFn } from "@tanstack/react-start"

const loadProviders = createClientOnlyFn(() =>
  import("./client").then((m) => m.Providers)
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <ClientSideProviders>{children}</ClientSideProviders>
}

function ClientSideProviders({ children }: { children: React.ReactNode }) {
  const [Providers, setProviders] = useState<React.ComponentType<{
    children: React.ReactNode
  }> | null>(null)

  useEffect(() => {
    loadProviders().then((m) => {
      setProviders(() => m)
    })
  }, [])

  if (!Providers) {
    return null
  }

  return <Providers>{children}</Providers>
}
