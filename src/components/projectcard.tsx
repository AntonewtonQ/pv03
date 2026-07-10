import { ArrowUpRight, ExternalLink } from "lucide-react";
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
    <article className="group flex min-h-[420px] flex-col border-t border-white/15 pt-4 text-white transition hover:border-orange-400/60">
      <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.08] bg-zinc-950">
        {hasCover ? (
          <img
            src={cover}
            alt={name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <Image
            src="/images/cover.png"
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-technical text-[11px] uppercase tracking-[0.16em] text-orange-400">
            {year}
          </span>
          <ProjectStatusBadge
            hasLink={Boolean(link)}
            initialStatus={status}
            checkComplete={statusCheckComplete}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-white">
            {name}
          </h3>
          <p className="text-sm leading-6 text-zinc-500">{description}</p>
        </div>
        <div className="mt-auto flex items-center gap-4 border-t border-white/[0.08] pt-4">
          <Link
            href={`/projects/${id}`}
            className="group/link inline-flex h-8 flex-1 items-center justify-between text-sm font-medium text-zinc-300 transition hover:text-orange-300"
          >
            {viewLabel}
            <ArrowUpRight
              size={16}
              className="transition group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </Link>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              title={visitLabel}
              aria-label={visitLabel}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border-l border-white/10 text-zinc-500 transition hover:text-orange-300"
            >
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
