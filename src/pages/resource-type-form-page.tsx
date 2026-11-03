import { useParams } from "react-router-dom";
import { ResourceTypeForm } from "@/features/resource-types/components/resource-type-form";

export function ResourceTypeFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  if (mode === "edit") {
    if (!id) return null;
    return <ResourceTypeForm mode="edit" typeId={id} />;
  }
  return <ResourceTypeForm mode="create" />;
}
