import type { AuditAction } from "@/shared/types/api";

export const AUDIT_ACTIONS: AuditAction[] = [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "PASSWORD_CHANGED",
  "RESOURCE_TYPE_CREATED",
  "RESOURCE_TYPE_UPDATED",
  "RESOURCE_TYPE_DELETED",
  "RESOURCE_CREATED",
  "RESOURCE_UPDATED",
  "RESOURCE_DELETED",
  "BOOKING_CREATED",
  "BOOKING_CANCELLED",
];

export const AUDIT_ENTITIES = ["User", "ResourceType", "Resource", "Booking"] as const;
