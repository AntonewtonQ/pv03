"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { PortfolioProject } from "@/lib/projects-server";
import { getProjectStory } from "@/lib/project-stories";
import ProjectCard from "./projectcard";

export default function ProjectsPage({
  projects,
  error,
}: {
  projects: PortfolioProject[];
  error: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Projects");
  const years = Array.from(
    new Set(projects.map((p) => p.year).filter(Boolean)),
  ).sort((a, b) => b.localeCompare(a));
  const filtered = selectedYear
    ? projects.filter((p) => p.year === selectedYear)
    : projects;
  return (
    <section className="px-6 py-8 md:px-10 md:py-10" aria-busy={pending}>
      <div className="mx-auto max-w-6xl space-y-8">
        {projects.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-5"
            role="group"
            aria-label={t("filterLabel")}
          >
            <p className="text-sm text-zinc-400">{t("filterLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {[null, ...years].map((year) => (
                <button
                  key={year || "all"}
                  type="button"
                  aria-pressed={selectedYear === year}
                  onClick={() => setSelectedYear(year)}
                  className={`min-h-11 border px-4 text-sm ${selectedYear === year ? "border-orange-400/50 bg-orange-400/10 text-orange-200" : "border-white/15 text-zinc-300 hover:border-white/40"}`}
                >
                  {year || t("all")}
                </button>
              ))}
            </div>
          </div>
        )}
        {error ? (
          <div
            role="status"
            className="border border-amber-300/30 p-8 text-amber-100"
          >
            <p>{t("error")}</p>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => router.refresh())}
              className="text-link mt-4 disabled:opacity-60"
            >
              {pending ? t("loading") : t("retry")}
            </button>
          </div>
        ) : (
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length ? (
              filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  description={
                    getProjectStory(project.id, locale)?.summary ||
                    project.description
                  }
                  viewLabel={t("viewProject")}
                  visitLabel={t("visitProject")}
                />
              ))
            ) : (
              <p role="status" className="col-span-full py-8 text-zinc-400">
                {t("noprojects")}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
