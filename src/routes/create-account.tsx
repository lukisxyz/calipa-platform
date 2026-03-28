import { createFileRoute } from "@tanstack/react-router"
import { createClientOnlyFn } from "@tanstack/react-start"
import { useState, useEffect } from "react"

const loadCreateAccountClient = createClientOnlyFn(() =>
  import("./-create-account.client").then((m) => m.CreateAccount)
)

export const Route = createFileRoute("/create-account")({
  component: CreateAccountPage,
})

function CreateAccountPage() {
  const [CreateAccountComponent, setCreateAccountComponent] =
    useState<React.ComponentType | null>(null)

  useEffect(() => {
    loadCreateAccountClient().then((comp) =>
      setCreateAccountComponent(() => comp)
    )
  }, [])

  if (!CreateAccountComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  return <CreateAccountComponent />
}
