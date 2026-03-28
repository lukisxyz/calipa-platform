import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAccount,
  accountExists,
  getAccountByUsername,
  createAccount,
} from "@/lib/server/functions"
import type { AccountInput } from "@/lib/db/schema"

export function useAccount(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["account", walletAddress],
    queryFn: () => getAccount({ data: { walletAddress: walletAddress! } }),
    enabled: !!walletAddress,
    retry: false,
  })
}

export function useAccountExists(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["account-exists", walletAddress],
    queryFn: () => accountExists({ data: { walletAddress: walletAddress! } }),
    enabled: !!walletAddress,
    retry: false,
  })
}

export function useAccountByUsername(username: string | undefined) {
  return useQuery({
    queryKey: ["account-by-username", username],
    queryFn: () => getAccountByUsername({ data: { username: username! } }),
    enabled: !!username,
    retry: false,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AccountInput) => createAccount({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["account", variables.walletAddress],
      })
    },
  })
}
