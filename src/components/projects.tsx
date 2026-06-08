"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { db } from "@/lib/firebase";
import ProjectCard from "./projectcard";
import { Button } from "./ui/button";

interface Project {
  id: string;
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const t = useTranslations("Projects");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList = querySnapshot.docs.map((projectDoc) => ({
          id: projectDoc.id,
          ...(projectDoc.data() as Omit<Project, "id">),
        }));
        setProjects(projectList);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    fetchProjects();
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.year))).sort(
      (a, b) => b.localeCompare(a)
    );
  }, [projects]);

  const filteredProjects = selectedYear
    ? projects.filter((project) => project.year === selectedYear)
    : projects;

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 border-y border-white/10 py-5 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Filter size={16} className="text-emerald-300" />
            {t("filterLabel")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedYear(null)}
              className={`h-9 border px-3 text-xs ${
                selectedYear === null
                  ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("all")}
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={`h-9 border px-3 text-xs ${
                  selectedYear === year
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {status === "loading" ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
            {t("loading")}
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-8 text-center text-sm text-amber-100">
            {t("error")}
          </div>
        ) : null}

        {status === "ready" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  viewLabel={t("viewProject")}
                  visitLabel={t("visitProject")}
                />
              ))
            ) : (
              <div className="col-span-full rounded-md border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
                {t("noprojects")}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
