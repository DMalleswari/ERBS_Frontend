import { Link } from "react-router-dom";
import { useResourceTypeQuery } from "@/features/resource-types/queries/use-resource-types";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatWhen } from "@/shared/utils/format";

export function ResourceTypeDetails({ typeId }: { typeId: string }) {
  const record = useResourceTypeQuery(typeId);
  if (record.isLoading) return <LoadingSpinner />;
  if (record.isError || !record.data) return <ErrorState error={record.error} onRetry={() => void record.refetch()} />;
  const type = record.data;

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Catalog"
        title={type.name}
        description={type.code}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/resource-types">Back</Link>
            </Button>
            <Button asChild>
              <Link to={`/resource-types/${type.id}/edit`}>Edit</Link>
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge active={type.isActive} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Code</dt>
              <dd className="mt-1 font-medium">{type.code}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="mt-1 font-medium">{type.name}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="mt-1 font-medium">{type.description || "No description"}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="mt-1 font-medium">{formatWhen(type.createdAt)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="mt-1 font-medium">{formatWhen(type.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
