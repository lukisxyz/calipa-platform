import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookingsByHost,
  getBookingsByEventType,
  getBookingById,
  checkSlotAvailability,
  createBooking,
  cancelBooking,
  confirmBooking,
} from "@/lib/server/functions";
import type { BookingInput } from "@/lib/db/schema";

export function useBookingsByHost(hostAccountId: string | undefined) {
  return useQuery({
    queryKey: ["bookings", "host", hostAccountId],
    queryFn: () =>
      getBookingsByHost({ data: { hostAccountId: hostAccountId! } }),
    enabled: !!hostAccountId,
  });
}

export function useBookingsByEventType(eventTypeId: string | undefined) {
  return useQuery({
    queryKey: ["bookings", "event-type", eventTypeId],
    queryFn: () =>
      getBookingsByEventType({ data: { eventTypeId: eventTypeId! } }),
    enabled: !!eventTypeId,
  });
}

export function useBookingById(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById({ data: { id: id! } }),
    enabled: !!id,
  });
}

export function useSlotAvailability(
  eventTypeId: string | undefined,
  startTime: Date | undefined,
  endTime: Date | undefined
) {
  return useQuery({
    queryKey: ["slot-availability", eventTypeId, startTime?.toISOString()],
    queryFn: () =>
      checkSlotAvailability({
        data: {
          eventTypeId: eventTypeId!,
          startTime: startTime!,
          endTime: endTime!,
        },
      }),
    enabled: !!eventTypeId && !!startTime && !!endTime,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingInput) => createBooking({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookings", "host", variables.hostAccountId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookings", "event-type", variables.eventTypeId],
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; reason?: string }) =>
      cancelBooking({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => confirmBooking({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
}
