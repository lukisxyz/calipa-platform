import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEventTypes,
  getEventTypeById,
  getEventTypeByUsernameAndSlug,
  getEventTypeCount,
  createEventType,
  updateEventType,
  deleteEventType,
} from "@/lib/server/functions";
import type { EventTypeInput } from "@/lib/db/schema";

export function useEventTypes(accountId: string | undefined) {
  return useQuery({
    queryKey: ["event-types", accountId],
    queryFn: () => getEventTypes({ data: { accountId: accountId! } }),
    enabled: !!accountId,
  });
}

export function useEventTypeById(id: string | undefined) {
  return useQuery({
    queryKey: ["event-type", id],
    queryFn: () => getEventTypeById({ data: { id: id! } }),
    enabled: !!id,
  });
}

export function useEventTypeByUsernameAndSlug(
  username: string | undefined,
  slug: string | undefined
) {
  return useQuery({
    queryKey: ["event-type-public", username, slug],
    queryFn: () =>
      getEventTypeByUsernameAndSlug({
        data: { username: username!, slug: slug! },
      }),
    enabled: !!username && !!slug,
  });
}

export function useEventTypeCount(accountId: string | undefined) {
  return useQuery({
    queryKey: ["event-type-count", accountId],
    queryFn: () => getEventTypeCount({ data: { accountId: accountId! } }),
    enabled: !!accountId,
  });
}

export function useCreateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventTypeInput) => createEventType({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-types", variables.accountId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event-type-count", variables.accountId],
      });
    },
  });
}

export function useUpdateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string } & Partial<EventTypeInput>) =>
      updateEventType({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-types"] });
      queryClient.invalidateQueries({ queryKey: ["event-type"] });
    },
  });
}

export function useDeleteEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => deleteEventType({ data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-types"] });
      queryClient.invalidateQueries({ queryKey: ["event-type", variables.id] });
    },
  });
}
