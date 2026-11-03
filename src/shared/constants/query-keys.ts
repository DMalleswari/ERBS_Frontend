export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    summary: ["dashboard", "summary"] as const,
  },
  health: {
    status: ["health", "status"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: unknown) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  resourceTypes: {
    all: ["resource-types"] as const,
    list: (params: unknown) => ["resource-types", "list", params] as const,
    detail: (id: string) => ["resource-types", "detail", id] as const,
  },
  resources: {
    all: ["resources"] as const,
    list: (params: unknown) => ["resources", "list", params] as const,
    detail: (id: string) => ["resources", "detail", id] as const,
  },
  availability: {
    lookup: (params: unknown) => ["availability", params] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (params: unknown) => ["bookings", "list", params] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: unknown) => ["notifications", "list", params] as const,
    unread: ["notifications", "unread"] as const,
  },
  auditLogs: {
    list: (params: unknown) => ["audit-logs", "list", params] as const,
  },
};
