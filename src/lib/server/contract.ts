import CalipaSchedulingAbi from "@/abi/CalipaScheduling.json";

// Contract address - should be set via environment variable
const CONTRACT_ADDRESS =
  process.env.CALIPA_SCHEDULING_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

// USDC token address - should be set via environment variable
const USDC_ADDRESS =
  process.env.USDC_TOKEN_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

export { CONTRACT_ADDRESS, USDC_ADDRESS };

// Contract function names
export const CONTRACT_FUNCTIONS = {
  SET_MENTOR_FEE: "setMentorFee",
  MENTOR_FEE: "mentorFee",
  BOOK_SESSION: "bookSession",
  ACKNOWLEDGE_ATTENDANCE: "acknowledgeAttendance",
  REFUND: "refund",
  CLAIM: "claim",
  SET_MENTEE_NO_SHOW: "setMenteeNoShow",
} as const;

// Helper to format USDC amount (6 decimals)
export function formatUSDC(amount: bigint): string {
  const formatted = Number(amount) / 1e6;
  return formatted.toFixed(2);
}

// Helper to parse USDC amount (6 decimals)
export function parseUSDC(amount: string): bigint {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) {
    throw new Error("Invalid amount");
  }
  return BigInt(Math.round(parsed * 1e6));
}

// Price type enum
export type PriceType = "free" | "paid" | "commitment";

// Contract configuration for wagmi
export const schedulingContractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CalipaSchedulingAbi.abi,
} as const;

// USDC token configuration
export const usdcTokenConfig = {
  address: USDC_ADDRESS as `0x${string}`,
  abi: CalipaSchedulingAbi.abi, // This should be replaced with ERC20 ABI
} as const;

// Booking status enum for commitment fee
export type CommitmentBookingStatus =
  | "pending"
  | "booked"
  | "acknowledged"
  | "refunded"
  | "claimed";

// Commitment booking details
export interface CommitmentBooking {
  bookingId: number;
  mentee: string;
  mentor: string;
  amount: bigint;
  sessionTimestamp: bigint;
  menteeNoShowMarked: boolean;
  noShowMarkedAt: bigint;
  acknowledged: boolean;
  payoutDone: boolean;
}
