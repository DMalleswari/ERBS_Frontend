import { ProfileCard } from "@/features/auth/components/profile-card";
import { PageHeader } from "@/shared/components/page-header";

export function ProfilePage() {
  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="Account" title="Profile" />
      <ProfileCard />
    </div>
  );
}
