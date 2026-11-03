import { Link } from "react-router-dom";
import { useUserQuery } from "@/features/users/queries/use-users";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { UserAvatar } from "@/shared/components/user-avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatWhen } from "@/shared/utils/format";

export function UserDetails({ userId }: { userId: string }) {
  const user = useUserQuery(userId);
  if (user.isLoading) return <LoadingSpinner />;
  if (user.isError) return <ErrorState error={user.error} onRetry={() => void user.refetch()} />;
  if (!user.data) return null;
  const record = user.data;

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="People"
        title={record.name}
        description={record.email}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/users">Back</Link>
            </Button>
            <Button asChild>
              <Link to={`/users/${record.id}/edit`}>Edit</Link>
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <div className="flex items-center gap-4">
            <UserAvatar name={record.name} className="h-16 w-16 text-lg" />
            <div>
              <p className="text-lg font-semibold">{record.name}</p>
              <p className="text-sm text-muted-foreground">{record.email}</p>
            </div>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{record.email}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="mt-1 break-all font-mono text-xs">{record.id}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.createdAt)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="mt-1 font-medium">{formatWhen(record.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
