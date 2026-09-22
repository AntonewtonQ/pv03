import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProjectStory } from "@/lib/project-stories";
import ProjectCover from "./project-cover";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
  viewLabel: string;
  visitLabel: string;
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
}: ProjectCardProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale();
  const story = getProjectStory(id, locale);
  return (
    <article className="group flex flex-col border-t border-white/15 pt-4">
      <ProjectCover src={cover} name={name} fallback={t("noCover")} />
      <div className="flex flex-1 flex-col py-5">
        <div className="flex flex-wrap justify-between gap-2 text-xs text-zinc-400">
          <span>{story ? t("personal") : year}</span>
          {story && <span>{year}</span>}
        </div>
        <h3 className="mt-3 text-xl font-medium tracking-tight">{name}</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
        {story && (
          <p className="mt-4 text-xs leading-6 text-zinc-400">
            {t("roleLabel")}: {t("role")}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            href={`/projects/${id}`}
            className="text-link text-sm"
            aria-label={`${viewLabel}: ${name}`}
          >
            {viewLabel}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-xs text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-orange-300"
              aria-label={`${visitLabel}: ${name}`}
            >
              {visitLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
