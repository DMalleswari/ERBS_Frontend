import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { useAvailabilityQuery } from "@/features/availability/queries/use-availability";
import { availabilitySchema, type AvailabilityValues } from "@/features/availability/schemas/availability-schema";
import { useResourceOptions } from "@/features/resources/queries/use-resources";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { FormField } from "@/shared/components/form-field";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { dayBounds, formatWhen, toDateTimeInput, todayDateInput } from "@/shared/utils/format";

export function AvailabilityLookup() {
  const [params] = useSearchParams();
  const resources = useResourceOptions();
  const form = useForm<AvailabilityValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { resourceId: params.get("resourceId") ?? "", date: todayDateInput() },
  });
  const [lookup, setLookup] = useState<AvailabilityValues | null>(null);
  const bounds = lookup ? dayBounds(lookup.date) : { from: "", to: "" };
  const availability = useAvailabilityQuery(lookup?.resourceId ?? "", bounds.from, bounds.to, Boolean(lookup));

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Schedule"
        title="Availability"
        description="Select a resource and date. Slots come from the backend — available in green, booked in red."
      />
      <Card>
        <CardContent className="pt-5">
          <form
            className="grid gap-4 md:grid-cols-[1fr_12rem_auto] md:items-end"
            onSubmit={form.handleSubmit((values) => setLookup(values))}
          >
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
                          {resource.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Date" htmlFor="date" error={form.formState.errors.date?.message}>
              <Input id="date" type="date" {...form.register("date")} />
            </FormField>
            <Button type="submit">Check slots</Button>
          </form>
        </CardContent>
      </Card>

      {availability.isLoading ? <Skeleton className="h-40 w-full" /> : null}
      {availability.isError ? <ErrorState error={availability.error} onRetry={() => void availability.refetch()} /> : null}

      {availability.data ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-success" /> Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-destructive" /> Booked
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availability.data.availableSlots.map((slot) => {
              const bookTo = `/bookings/new?resourceId=${availability.data.resourceId}&start=${encodeURIComponent(toDateTimeInput(new Date(slot.startTime)))}&end=${encodeURIComponent(toDateTimeInput(new Date(slot.endTime)))}`;
              return (
                <div
                  key={`a-${slot.startTime}-${slot.endTime}`}
                  className="rounded-xl border border-success/25 bg-success-soft p-3"
                >
                  <p className="text-xs font-medium text-success">Available</p>
                  <p className="mt-1 text-sm font-medium">{formatWhen(slot.startTime)}</p>
                  <p className="text-xs text-muted-foreground">to {formatWhen(slot.endTime)}</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link to={bookTo}>Book this slot</Link>
                  </Button>
                </div>
              );
            })}
            {availability.data.bookedSlots.map((slot) => (
              <div
                key={`b-${slot.startTime}-${slot.endTime}`}
                className="rounded-xl border border-destructive/20 bg-danger-soft p-3"
              >
                <p className="text-xs font-medium text-destructive">Booked</p>
                <p className="mt-1 text-sm font-medium">{formatWhen(slot.startTime)}</p>
                <p className="text-xs text-muted-foreground">to {formatWhen(slot.endTime)}</p>
              </div>
            ))}
          </div>
          {availability.data.availableSlots.length === 0 && availability.data.bookedSlots.length === 0 ? (
            <EmptyState title="No slots returned for this date" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
