export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DataResponse<T> = {
  success: true;
  data: T;
};

export type PageResponse<T> = {
  success: true;
  data: T[];
  meta: PageMeta;
};

export type MessageResponse = {
  success: true;
  message: string;
};

export type PageResult<T> = {
  items: T[];
  meta: PageMeta;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  token: string;
  user: User;
};

export type ResourceType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Resource = {
  id: string;
  name: string;
  description: string | null;
  resourceTypeId: string;
  capacity: number;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookingStatus = "ACTIVE" | "CANCELLED";

export type Booking = {
  id: string;
  userId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type Availability = {
  resourceId: string;
  from: string;
  to: string;
  bookedSlots: TimeSlot[];
  availableSlots: TimeSlot[];
};

export type DashboardSummary = {
  totalUsers: number;
  totalResources: number;
  totalBookings: number;
  activeResources: number;
  todaysBookings: number;
};

export type HealthStatus = {
  status: "ok" | "degraded";
  service: string;
  database: "up" | "down";
  environment: string;
  uptime: number;
  timestamp: string;
};

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "PASSWORD_CHANGED"
  | "RESOURCE_TYPE_CREATED"
  | "RESOURCE_TYPE_UPDATED"
  | "RESOURCE_TYPE_DELETED"
  | "RESOURCE_CREATED"
  | "RESOURCE_UPDATED"
  | "RESOURCE_DELETED"
  | "BOOKING_CREATED"
  | "BOOKING_CANCELLED";

export type AuditLog = {
  id: string;
  actorId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};
