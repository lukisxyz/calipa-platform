import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { useAccount, useAccountExists } from "@/queries/useAccount";
import { useSetMentorFee, useMentorFee } from "@/hooks/useCalipaScheduling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_protected/account")({
  component: AccountPage,
});

function AccountPage() {
  const { initiaAddress } = useInterwovenKit();
  const { data: accountExists, isLoading: isLoadingExists } =
    useAccountExists(initiaAddress);
  const { data: account, isLoading: isLoadingAccount } =
    useAccount(initiaAddress);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="space-y-8">
        {/* Account Information Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </div>
              {account && (
                <Button variant="outline">
                  <Link to="/edit-account">Edit</Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingAccount ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : isLoadingExists ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : !accountExists ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You haven&apos;t created an account yet. Create one to start
                  accepting bookings.
                </p>
                <Button>
                  <Link to="/create-account">Create Account</Link>
                </Button>
              </div>
            ) : account ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="text-lg font-semibold">@{account.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-semibold">{account.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-semibold">{account.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Timezone
                  </p>
                  <p className="text-lg font-semibold">{account.timezone}</p>
                </div>
                {account.bio && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bio
                    </p>
                    <p className="text-sm">{account.bio}</p>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Mentor Fee Set Section */}
        <MentorFeeSection />
      </div>
    </div>
  );
}

function MentorFeeSection() {
  const { initiaAddress } = useInterwovenKit();
  const { mentorFee, isLoading: isLoadingFee } = useMentorFee(initiaAddress);
  const { setMentorFee, isPending, isSuccess, error } = useSetMentorFee();

  const [feeInput, setFeeInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert USDC amount (6 decimals) to wei
    const feeInWei = BigInt(
      Math.floor(Number(feeInput) * 1_000_000)
    ).toString();
    setMentorFee(BigInt(feeInWei));
  };

  const formatFee = (fee: bigint | undefined) => {
    if (!fee || fee === 0n) return "Not registered";
    const usdcAmount = Number(fee) / 1_000_000;
    return `$${usdcAmount.toFixed(2)} USDC`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Fee Set</CardTitle>
        <CardDescription>
          Set your session fee to start accepting bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingFee ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : mentorFee && mentorFee !== 0n ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Fee</p>
              <p className="text-2xl font-bold">{formatFee(mentorFee)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You are registered as a mentor. Update your fee below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fee">New Fee (USDC)</Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="100"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Enter amount in USDC (e.g., 100 = $100 USDC)
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !feeInput}
              >
                {isPending ? "Processing..." : "Update Fee"}
              </Button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fee-new">Session Fee (USDC)</Label>
              <Input
                id="fee-new"
                type="number"
                placeholder="100"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount in USDC (e.g., 100 = $100 USDC per session)
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !feeInput}
            >
              {isPending ? "Processing..." : "Register as Mentor"}
            </Button>
          </form>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-500">Error: {error.message}</p>
        )}
        {isSuccess && (
          <p className="mt-4 text-sm text-green-500">
            Successfully registered! Your fee has been set.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
