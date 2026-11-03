import { Badge } from "@/shared/components/ui/badge";

type StatusBadgeProps = {
  active?: boolean;
  status?: "ACTIVE" | "CANCELLED";
};

export function StatusBadge({ active, status }: StatusBadgeProps) {
  if (status) {
    return (
      <Badge variant={status === "ACTIVE" ? "success" : "danger"}>
        {status === "ACTIVE" ? "Active" : "Cancelled"}
      </Badge>
    );
  }
  return <Badge variant={active ? "success" : "muted"}>{active ? "Active" : "Inactive"}</Badge>;
}
