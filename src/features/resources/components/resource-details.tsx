import { Link } from "react-router-dom";
import { useResourceTypeQuery } from "@/features/resource-types/queries/use-resource-types";
import { useResourceQuery } from "@/features/resources/queries/use-resources";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatWhen } from "@/shared/utils/format";

export function ResourceDetails({ resourceId }: { resourceId: string }) {
  const resource = useResourceQuery(resourceId);
  const type = useResourceTypeQuery(resource.data?.resourceTypeId ?? "");
  if (resource.isLoading) return <LoadingSpinner />;
  if (resource.isError || !resource.data) return <ErrorState error={resource.error} onRetry={() => void resource.refetch()} />;
  const record = resource.data;

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Catalog"
        title={record.name}
        description={record.location}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/resources">Back</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/availability?resourceId=${record.id}`}>Availability</Link>
            </Button>
            <Button asChild>
              <Link to={`/resources/${record.id}/edit`}>Edit</Link>
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge active={record.isActive} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="mt-1 font-medium">{type.data?.name ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Capacity</dt>
              <dd className="mt-1 font-medium">{record.capacity}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Location</dt>
              <dd className="mt-1 font-medium">{record.location}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.createdAt)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="mt-1 font-medium">{record.description || "No description"}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
