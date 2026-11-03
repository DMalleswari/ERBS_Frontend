import type { PageMeta } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";

type PaginationProps = {
  meta: PageMeta | undefined;
  onPage: (page: number) => void;
};

export function Pagination({ meta, onPage }: PaginationProps) {
  if (!meta) return null;
  const totalPages = Math.max(meta.totalPages, 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        {meta.total} total · page {meta.page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>
          Previous
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={meta.page >= totalPages} onClick={() => onPage(meta.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
