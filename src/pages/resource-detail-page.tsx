import { useParams } from "react-router-dom";
import { ResourceDetails } from "@/features/resources/components/resource-details";

export function ResourceDetailPage() {
  const { id } = useParams();
  if (!id) return null;
  return <ResourceDetails resourceId={id} />;
}
