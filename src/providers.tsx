import { createClientOnlyFn } from "@tanstack/react-start"
import { useState, useEffect } from "react"

const loadProviders = createClientOnlyFn(() =>
  import("./providers.client").then((m) => m.Providers)
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [ProvidersComponent, setProvidersComponent] =
    useState<React.ComponentType<{ children: React.ReactNode }> | null>(null)

  useEffect(() => {
    loadProviders().then((comp) => setProvidersComponent(() => comp))
  }, [])

  if (!ProvidersComponent) {
    return <>{children}</>
  }

  return <ProvidersComponent>{children}</ProvidersComponent>
}
