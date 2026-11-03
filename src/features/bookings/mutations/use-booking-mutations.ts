import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/features/bookings/services/booking-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("Booking created");
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.cancel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("Booking cancelled");
    },
  });
}
