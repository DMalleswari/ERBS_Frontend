import { useParams } from "react-router-dom";
import { ResourceTypeDetails } from "@/features/resource-types/components/resource-type-details";

export function ResourceTypeDetailPage() {
  const { id } = useParams();
  if (!id) return null;
  return <ResourceTypeDetails typeId={id} />;
}
