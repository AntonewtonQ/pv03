import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ProjectStatusResult } from "@/lib/project-status-types";
import ProjectStatusBadge from "./project-status-badge";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
  viewLabel: string;
  visitLabel: string;
  status?: ProjectStatusResult;
  statusCheckComplete?: boolean;
}

export default function ProjectCard({
  id,
  name,
  description,
  year,
  cover,
  link,
  viewLabel,
  visitLabel,
  status,
  statusCheckComplete,
}: ProjectCardProps) {
  const hasCover = Boolean(cover?.trim());

  return (
    <article className="group flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-white transition hover:border-white/25 hover:bg-white/[0.06]">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
        {hasCover ? (
          <img
            src={cover}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src="/images/cover.png"
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
            {year}
          </span>
          <ProjectStatusBadge
            hasLink={Boolean(link)}
            initialStatus={status}
            checkComplete={statusCheckComplete}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-snug text-white">{name}</h3>
          <p className="text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <div className="mt-auto flex gap-2">
          <Link
            href={`/projects/${id}`}
            className="inline-flex h-10 flex-1 items-center justify-between rounded-md border border-white/10 bg-black px-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            {viewLabel}
            <ArrowRight size={16} />
          </Link>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              title={visitLabel}
              aria-label={visitLabel}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black text-white transition hover:bg-white hover:text-black"
            >
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
