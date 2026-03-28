"use client"

import { useInterwovenKit } from "@initia/interwovenkit-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import * as v from "valibot"

const getStoredAccount = (address: string) => {
  if (typeof window === "undefined") return null
  const accounts = localStorage.getItem("calipa_accounts")
  if (!accounts) return null
  const parsed = JSON.parse(accounts)
  return parsed[address] || null
}

const saveAccount = (address: string, data: any) => {
  if (typeof window === "undefined") return
  const accounts = localStorage.getItem("calipa_accounts")
  const parsed = accounts ? JSON.parse(accounts) : {}
  parsed[address] = data
  localStorage.setItem("calipa_accounts", JSON.stringify(parsed))
}

const accountSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, "Username must be at least 3 characters"),
    v.maxLength(30, "Username must be at most 30 characters"),
    v.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and dashes"
    )
  ),
  name: v.pipe(
    v.string(),
    v.minLength(1, "Name is required"),
    v.maxLength(100, "Name must be at most 100 characters")
  ),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  bio: v.optional(v.string()),
})

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

export function CreateAccount() {
  const { initiaAddress } = useInterwovenKit()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initiaAddress) {
      const account = getStoredAccount(initiaAddress)
      if (account) {
        navigate({ to: "/dashboard" })
      }
    }
  }, [initiaAddress, navigate])

  const form = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      bio: "",
    },
    onSubmit: async ({ value }) => {
      if (!initiaAddress) {
        setError("Wallet not connected")
        return
      }

      const result = v.safeParse(accountSchema, value)
      if (!result.success) {
        setError(result.issues[0]?.message || "Validation failed")
        return
      }

      const accounts = localStorage.getItem("calipa_accounts")
      if (accounts) {
        const parsed = JSON.parse(accounts)
        const existing = Object.values(parsed).find(
          (a: any) => a.username === value.username
        )
        if (existing) {
          setError("Username already taken")
          return
        }
      }

      setSubmitting(true)
      setError(null)

      try {
        saveAccount(initiaAddress, {
          walletAddress: initiaAddress,
          username: value.username,
          name: value.name,
          email: value.email,
          bio: value.bio || "",
          createdAt: new Date().toISOString(),
        })

        navigate({ to: "/dashboard" })
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create account")
      } finally {
        setSubmitting(false)
      }
    },
  })

  if (!initiaAddress) {
    return (
      <>
        <GrainyBackground />
        <main className="flex min-h-svh flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-4 text-center">
            <h1 className="text-2xl font-bold text-slate-800">
              Connect Wallet First
            </h1>
            <p className="text-slate-500">
              Please connect your wallet to create an account.
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <GrainyBackground />
      <main className="flex min-h-svh flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Set up your profile to start accepting bookings
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              <form.Field
                name="username"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Username</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="johndoe"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="name"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Full Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="John Doe"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="email"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="john@example.com"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="bio"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Bio (optional)</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Tell people about yourself..."
                      rows={3}
                    />
                  </div>
                )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full py-6 text-base font-semibold"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
