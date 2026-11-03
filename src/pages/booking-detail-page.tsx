import { useParams } from "react-router-dom";
import { BookingDetails } from "@/features/bookings/components/booking-details";

export function BookingDetailPage() {
  const { id } = useParams();
  if (!id) return null;
  return <BookingDetails bookingId={id} />;
}
