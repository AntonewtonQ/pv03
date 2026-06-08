"use client";

import { Activity, CircleHelp, Loader2, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { ProjectStatusResult } from "@/lib/project-status-types";

interface ProjectStatusBadgeProps {
  projectId?: string;
  hasLink: boolean;
  initialStatus?: ProjectStatusResult;
  checkComplete?: boolean;
  className?: string;
}

export default function ProjectStatusBadge({
  projectId,
  hasLink,
  initialStatus,
  checkComplete = false,
  className = "",
}: ProjectStatusBadgeProps) {
  const t = useTranslations("ProjectStatus");
  const [status, setStatus] = useState<ProjectStatusResult | undefined>(
    initialStatus
  );
  const [finished, setFinished] = useState(checkComplete);

  useEffect(() => {
    setStatus(initialStatus);
    setFinished(checkComplete);
  }, [checkComplete, initialStatus]);

  useEffect(() => {
    if (!projectId || initialStatus || !hasLink) {
      return;
    }

    let active = true;

    const loadStatus = async () => {
      try {
        const response = await fetch(
          `/api/projects/status?id=${encodeURIComponent(projectId)}`
        );
        const data = (await response.json()) as {
          statuses?: ProjectStatusResult[];
        };

        if (active) {
          setStatus(data.statuses?.[0]);
        }
      } catch {
        if (active) {
          setStatus(undefined);
        }
      } finally {
        if (active) {
          setFinished(true);
        }
      }
    };

    void loadStatus();

    return () => {
      active = false;
    };
  }, [hasLink, initialStatus, projectId]);

  const availability = !hasLink
    ? "unavailable"
    : status?.status || (finished ? "unknown" : "checking");
  const styles = {
    online: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    degraded: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    offline: "border-red-300/30 bg-red-300/10 text-red-100",
    unavailable: "border-white/10 bg-white/[0.03] text-zinc-500",
    unknown: "border-white/10 bg-white/[0.03] text-zinc-400",
    checking: "border-white/10 bg-white/[0.03] text-zinc-400",
  }[availability];
  const label = t(availability);
  const detail =
    status?.responseTime != null && availability !== "offline"
      ? ` · ${status.responseTime} ms`
      : "";
  const Icon =
    availability === "checking"
      ? Loader2
      : availability === "offline"
        ? WifiOff
        : availability === "unknown" || availability === "unavailable"
          ? CircleHelp
          : Activity;

  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-xs ${styles} ${className}`}
      title={status ? t("checkedAt", { date: new Date(status.checkedAt) }) : label}
    >
      <Icon
        size={13}
        className={availability === "checking" ? "animate-spin" : ""}
      />
      <span>
        {label}
        {detail}
      </span>
    </span>
  );
}
