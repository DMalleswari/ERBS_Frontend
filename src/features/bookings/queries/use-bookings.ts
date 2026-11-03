import { useQuery } from "@tanstack/react-query";
import { bookingService, type BookingListParams } from "@/features/bookings/services/booking-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useBookingsQuery(params: BookingListParams) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => bookingService.list(params),
  });
}

export function useBookingQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingService.get(id),
    enabled: Boolean(id),
  });
}
