import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
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

export function useBookSession() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const bookSession = async (mentor: string, timestamp: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "bookSession",
      args: [mentor as `0x${string}`, timestamp],
    });
  };

  return {
    bookSession,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useAcknowledgeAttendance() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const acknowledgeAttendance = async (bookingId: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "acknowledgeAttendance",
      args: [bookingId],
    });
  };

  return {
    acknowledgeAttendance,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useRefund() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const refund = async (bookingId: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "refund",
      args: [bookingId],
    });
  };

  return {
    refund,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useClaim() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claim = async (bookingId: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "claim",
      args: [bookingId],
    });
  };

  return {
    claim,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useSetMenteeNoShow() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const setMenteeNoShow = async (bookingId: bigint) => {
    writeContract({
      ...calipaSchedulingConfig,
      functionName: "setMenteeNoShow",
      args: [bookingId],
    });
  };

  return {
    setMenteeNoShow,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useBookingCounter() {
  const { data, isLoading, error, refetch } = useReadContract({
    ...calipaSchedulingConfig,
    functionName: "bookingCounter",
    query: {},
  });

  return {
    bookingCounter: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

export function useBookingDetails(bookingId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...calipaSchedulingConfig,
    functionName: "bookings",
    args: bookingId ? [bookingId] : undefined,
    query: {
      enabled: !!bookingId,
    },
  });

  return {
    booking: data as
      | {
          mentee: string;
          mentor: string;
          amount: bigint;
          sessionTimestamp: bigint;
          menteeNoShowMarked: boolean;
          noShowMarkedAt: bigint;
          acknowledged: boolean;
          payoutDone: boolean;
        }
      | undefined,
    isLoading,
    error,
    refetch,
  };
}
