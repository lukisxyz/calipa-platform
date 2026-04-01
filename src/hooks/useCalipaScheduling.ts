import { useWriteContract, useReadContract } from "wagmi";
import { calipaSchedulingConfig } from "../providers/client";

export function useSetMentorFee() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const setMentorFee = async (fee: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "setMentorFee",
      args: [fee],
    });
  };

  return {
    setMentorFee,
    isPending,
    isSuccess,
    error,
  };
}

export function useMentorFee(address?: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...calipaSchedulingConfig,
    functionName: "mentorFee",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    mentorFee: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}
