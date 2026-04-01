import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useAccount } from "@/queries/useAccount";
import { useUpdateAccount } from "@/queries/useAccount";
import { TimezoneSelect } from "@/components/ui/timezone-select";
import * as v from "valibot";

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
  timezone: v.pipe(v.string(), v.minLength(1, "Timezone is required")),
  bio: v.optional(v.string()),
});

export const Route = createFileRoute("/_protected/edit-account")({
  component: EditAccountPage,
});

function EditAccountPage() {
  const { initiaAddress } = useInterwovenKit();
  const navigate = useNavigate();
  const { data: account, isLoading: isLoadingAccount } =
    useAccount(initiaAddress);
  const updateAccount = useUpdateAccount();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingAccount && !account) {
      navigate({ to: "/account", viewTransition: true });
    }
  }, [account, isLoadingAccount, navigate]);

  const form = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      timezone: "",
      bio: "",
    },
    onSubmit: async ({ value }) => {
      if (!initiaAddress) {
        setError("Wallet not connected");
        return;
      }

      const result = v.safeParse(accountSchema, value);
      if (!result.success) {
        setError(result.issues[0]?.message || "Validation failed");
        return;
      }

      setError(null);

      try {
        await updateAccount.mutateAsync({
          walletAddress: initiaAddress,
          username: value.username,
          name: value.name,
          email: value.email,
          timezone: value.timezone,
          bio: value.bio || "",
        });

        navigate({ to: "/account", viewTransition: true });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update account");
      }
    },
  });

  useEffect(() => {
    if (account) {
      form.setFieldValue("username", account.username);
      form.setFieldValue("name", account.name);
      form.setFieldValue("email", account.email);
      form.setFieldValue("timezone", account.timezone);
      form.setFieldValue("bio", account.bio || "");
    }
  }, [account]);

  if (isLoadingAccount) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Account</h1>
          <Button variant="ghost" size="sm">
            <Link to="/account">Cancel</Link>
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
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
            name="timezone"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Timezone</Label>
                <TimezoneSelect
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  placeholder="Select your timezone"
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
            className="w-full"
            disabled={updateAccount.isPending}
          >
            {updateAccount.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
