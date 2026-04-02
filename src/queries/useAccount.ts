import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccount,
  accountExists,
  getAccountByUsername,
  createAccount,
  updateAccount,
  getAccountByEmail,
  createOrUpdateAccountFromBooking,
  checkIsMentor,
} from "@/lib/server/functions";
import type { AccountInput } from "@/lib/db/schema";

export function useAccount(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["account", walletAddress],
    queryFn: () => getAccount({ data: { walletAddress: walletAddress! } }),
    enabled: !!walletAddress,
    retry: false,
  });
}

export function useAccountExists(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["account-exists", walletAddress],
    queryFn: () => accountExists({ data: { walletAddress: walletAddress! } }),
    enabled: !!walletAddress,
    retry: false,
  });
}

export function useAccountByUsername(username: string | undefined) {
  return useQuery({
    queryKey: ["account-by-username", username],
    queryFn: () => getAccountByUsername({ data: { username: username! } }),
    enabled: !!username,
    retry: false,
  });
}

export function useAccountByEmail(email: string | undefined) {
  return useQuery({
    queryKey: ["account-by-email", email],
    queryFn: () => getAccountByEmail({ data: { email: email! } }),
    enabled: !!email && email.length > 0,
    retry: false,
  });
}

export function useCheckIsMentor(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["check-is-mentor", walletAddress],
    queryFn: () => checkIsMentor({ data: { walletAddress: walletAddress! } }),
    enabled: !!walletAddress,
    retry: false,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountInput) => createAccount({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["account", variables.walletAddress],
      });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { walletAddress: string } & Partial<AccountInput>) =>
      updateAccount({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["account", variables.walletAddress],
      });
    },
  });
}

export function useCreateOrUpdateAccountFromBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      walletAddress?: string | null;
      name: string;
      email: string;
      timezone: string;
    }) => createOrUpdateAccountFromBooking({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["account-by-email"] });
    },
  });
}
