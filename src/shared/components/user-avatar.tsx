import { cn } from "@/shared/utils/cn";

function initials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type UserAvatarProps = {
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function UserAvatar({ name, className, size = "md" }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full bg-primary/15 font-semibold text-primary",
        size === "sm" && "h-7 w-7 text-[10px]",
        size === "md" && "h-8 w-8 text-xs",
        size === "lg" && "h-16 w-16 text-lg",
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
