import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCreateBookingMutation } from "@/features/bookings/mutations/use-booking-mutations";
import { createBookingSchema, type CreateBookingValues } from "@/features/bookings/schemas/booking-schema";
import { useResourceOptions } from "@/features/resources/queries/use-resources";
import { FormField } from "@/shared/components/form-field";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { getErrorMessage } from "@/shared/utils/error";
import { upcomingHourRange } from "@/shared/utils/format";

export function BookingForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const resources = useResourceOptions();
  const createBooking = useCreateBookingMutation();
  const range = upcomingHourRange();
  const form = useForm<CreateBookingValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      resourceId: params.get("resourceId") ?? "",
      startTime: params.get("start") ?? range.startTime,
      endTime: params.get("end") ?? range.endTime,
    },
  });

  return (
    <div className="grid gap-4">
      <PageHeader
        title="New booking"
        description="Reserve a resource for a specific time window."
        actions={
          <Button asChild variant="outline">
            <Link to="/bookings">Back</Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-5">
          <form
            className="grid max-w-lg gap-4"
            onSubmit={form.handleSubmit((values) =>
              createBooking.mutate(values, { onSuccess: (booking) => navigate(`/bookings/${booking.id}`) }),
            )}
            noValidate
          >
            {createBooking.isError ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
                {getErrorMessage(createBooking.error)}
              </p>
            ) : null}
            <FormField label="Resource" htmlFor="resourceId" error={form.formState.errors.resourceId?.message}>
              <Controller
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="resourceId">
                      <SelectValue placeholder="Select a resource" />
                    </SelectTrigger>
                    <SelectContent>
                      {(resources.data?.items ?? []).map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name} · {resource.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Starts" htmlFor="startTime" error={form.formState.errors.startTime?.message}>
              <Input id="startTime" type="datetime-local" {...form.register("startTime")} />
            </FormField>
            <FormField label="Ends" htmlFor="endTime" error={form.formState.errors.endTime?.message}>
              <Input id="endTime" type="datetime-local" {...form.register("endTime")} />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={createBooking.isPending}>
                {createBooking.isPending ? "Reserving…" : "Create booking"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/availability">Check availability</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
