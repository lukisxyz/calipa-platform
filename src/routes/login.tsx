import { createFileRoute } from "@tanstack/react-router"
import { createClientOnlyFn } from "@tanstack/react-start"
import { useState, useEffect } from "react"

const loadLoginClient = createClientOnlyFn(() =>
  import("./-login.client").then((m) => m.Login)
)

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const [LoginComponent, setLoginComponent] =
    useState<React.ComponentType | null>(null)

  useEffect(() => {
    loadLoginClient().then((comp) => setLoginComponent(() => comp))
  }, [])

  if (!LoginComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500">Loading wallet...</div>
      </div>
    )
  }

  return <LoginComponent />
}
