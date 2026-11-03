import { useParams } from "react-router-dom";
import { ResourceForm } from "@/features/resources/components/resource-form";

export function ResourceFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  if (mode === "edit") {
    if (!id) return null;
    return <ResourceForm mode="edit" resourceId={id} />;
  }
  return <ResourceForm mode="create" />;
}
