import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useCancelBookingMutation } from "@/features/bookings/mutations/use-booking-mutations";
import { useBookingQuery } from "@/features/bookings/queries/use-bookings";
import { useResourceQuery } from "@/features/resources/queries/use-resources";
import { useUserQuery } from "@/features/users/queries/use-users";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatWhen } from "@/shared/utils/format";

export function BookingDetails({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const booking = useBookingQuery(bookingId);
  const resource = useResourceQuery(booking.data?.resourceId ?? "");
  const owner = useUserQuery(booking.data?.userId ?? "");
  const cancel = useCancelBookingMutation();
  const [open, setOpen] = useState(false);

  if (booking.isLoading) return <LoadingSpinner />;
  if (booking.isError || !booking.data) return <ErrorState error={booking.error} onRetry={() => void booking.refetch()} />;
  const record = booking.data;
  const canCancel = record.status === "ACTIVE" && record.userId === user?.id;

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Schedule"
        title={resource.data?.name ?? "Booking"}
        description={`Booked by ${owner.data?.name ?? "…"}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/bookings">Back</Link>
            </Button>
            {canCancel ? (
              <Button variant="destructive" onClick={() => setOpen(true)}>
                Cancel booking
              </Button>
            ) : null}
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge status={record.status} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Resource</dt>
              <dd className="mt-1 font-medium">{resource.data?.name ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Booked by</dt>
              <dd className="mt-1 font-medium">{owner.data?.name ?? "—"}</dd>
              <dd className="text-xs text-muted-foreground">{owner.data?.email}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Starts</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.startTime)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Ends</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.endTime)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Booking ID</dt>
              <dd className="mt-1 break-all font-mono text-xs">{record.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={open}
        title="Cancel booking"
        description="The slot will open for someone else."
        confirmLabel="Cancel booking"
        pending={cancel.isPending}
        onOpenChange={setOpen}
        onConfirm={() => cancel.mutate(record.id, { onSuccess: () => setOpen(false) })}
      />
    </div>
  );
}
