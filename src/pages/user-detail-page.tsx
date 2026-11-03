import { useParams } from "react-router-dom";
import { UserDetails } from "@/features/users/components/user-details";

export function UserDetailPage() {
  const { id } = useParams();
  if (!id) return null;
  return <UserDetails userId={id} />;
}
