import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

type Defaults = {
  sortBy?: string;
  order?: "asc" | "desc";
};

export function useListQueryState(defaults: Defaults = {}) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const search = params.get("q") ?? "";
  const sortBy = params.get("sortBy") ?? defaults.sortBy ?? "";
  const order = (params.get("order") === "desc" ? "desc" : params.get("order") === "asc" ? "asc" : defaults.order) ?? "asc";
  const [draft, setDraft] = useState(search);
  const debounced = useDebouncedValue(draft, 300);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (debounced === search) return;
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (debounced) next.set("q", debounced);
        else next.delete("q");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }, [debounced, search, setParams]);

  function patch(values: Record<string, string | undefined>) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      for (const [key, value] of Object.entries(values)) {
        if (!value) next.delete(key);
        else next.set(key, value);
      }
      return next;
    });
  }

  function setPage(nextPage: number) {
    patch({ page: nextPage > 1 ? String(nextPage) : undefined });
  }

  function setSort(nextSortBy: string, nextOrder: "asc" | "desc") {
    patch({ sortBy: nextSortBy, order: nextOrder, page: undefined });
  }

  return { page, search, draft, setDraft, sortBy, order, patch, setPage, setSort, params };
}
