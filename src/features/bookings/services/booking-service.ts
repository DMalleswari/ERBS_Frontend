import { getData, getPage, sendData } from "@/shared/api/client";
import type { Booking, BookingStatus, ListParams } from "@/shared/types/api";
import { fromDateTimeInput } from "@/shared/utils/format";
import type { CreateBookingValues } from "@/features/bookings/schemas/booking-schema";

export type BookingListParams = ListParams & {
  userId?: string;
  resourceId?: string;
  status?: BookingStatus;
  scope?: "all" | "mine";
};

export const bookingService = {
  list(params: BookingListParams) {
    const { scope, ...query } = params;
    return getPage<Booking>(scope === "mine" ? "/bookings/me" : "/bookings", query);
  },
  get(id: string) {
    return getData<Booking>(`/bookings/${id}`);
  },
  create(input: CreateBookingValues) {
    return sendData<Booking>("/bookings", {
      resourceId: input.resourceId,
      startTime: fromDateTimeInput(input.startTime),
      endTime: fromDateTimeInput(input.endTime),
    });
  },
  cancel(id: string) {
    return sendData<Booking>(`/bookings/${id}/cancel`);
  },
};
