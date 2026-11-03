import { useParams } from "react-router-dom";
import { UserForm } from "@/features/users/components/user-form";

export function UserFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  if (mode === "edit") {
    if (!id) return null;
    return <UserForm mode="edit" userId={id} />;
  }
  return <UserForm mode="create" />;
}
