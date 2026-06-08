export type ProjectAvailability =
  | "online"
  | "degraded"
  | "offline"
  | "unavailable"
  | "unknown";

export interface ProjectStatusResult {
  id: string;
  status: ProjectAvailability;
  responseTime: number | null;
  statusCode: number | null;
  checkedAt: string;
}
