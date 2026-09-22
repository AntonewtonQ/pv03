import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PortfolioProject } from "@/lib/projects-server";
import Services from "./services";
import WorkProcess from "./work-process";
import ContactCTA from "./contact-cta";
import ProjectCard from "./projectcard";
import { getProjectStory } from "@/lib/project-stories";

export default function Menu({
  projects,
  projectsError,
}: {
  projects: PortfolioProject[];
  projectsError: boolean;
}) {
  const t = useTranslations("Home");
  const p = useTranslations("Projects");
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <section className="relative py-14 md:py-20 lg:py-24">
        <p className="eyebrow max-w-xl leading-6">{t("eyebrow")}</p>
        <div className="mt-7 grid gap-9 lg:grid-cols-[1fr_270px] lg:items-end lg:gap-10">
          <div>
            <h1 className="max-w-3xl text-[clamp(2.8rem,6.6vw,5.6rem)] font-medium leading-[1.04] tracking-[-0.065em]">
              {t("title")}
              <span className="block text-orange-400">{t("titleAccent")}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="primary-cta">
                {t("primaryAction")}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="#work" className="secondary-cta">
                {t("secondaryAction")}
                <ArrowDownRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <aside className="hidden border-l border-white/15 pl-7 lg:block">
            <Image
              src="/my-avatar.png"
              alt="Antonewton Quima"
              width={112}
              height={140}
              className="mb-5 h-32 w-28 object-contain"
            />
            <p className="text-lg font-medium">Antonewton Quima</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{t("note")}</p>
          </aside>
        </div>
        <p className="mt-10 border-t border-white/10 pt-5 text-xs leading-6 text-zinc-400 md:mt-14">
          {t("location")}
        </p>
      </section>
      <Services />
      <section
        id="work"
        className="scroll-mt-36 border-t border-white/10 py-16 md:py-24"
      >
        <p className="eyebrow">{t("selectedEyebrow")}</p>
        <h2 className="section-title mt-4">{t("selectedTitle")}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
          {t("selectedIntro")}
        </p>
        <div className="mt-10 grid gap-x-7 gap-y-10 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              description={
                getProjectStory(project.id, locale)?.summary ||
                project.description
              }
              viewLabel={p("viewProject")}
              visitLabel={p("visitProject")}
            />
          ))}
        </div>
        {projectsError || !projects.length ? (
          <p role="status" className="mt-5 text-zinc-400">
            {p(projectsError ? "error" : "noprojects")}
          </p>
        ) : null}
        <Link href="/projects" className="text-link mt-8">
          {t("allProjects")}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
      <section className="grid gap-10 border-t border-white/10 py-16 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <p className="eyebrow">Antonewton Quima</p>
          <h2 className="section-title mt-4">{t("aboutTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            {t("aboutText")}
          </p>
          <Link className="text-link mt-6" href="/about">
            {t("aboutLink")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="border-l border-orange-400/50 pl-6 md:pl-8">
          <h2 className="text-3xl font-medium leading-tight tracking-tight">
            {t("agencyTitle")}
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-300">
            {t("agencyText")}
          </p>
          <Link className="text-link mt-6" href="/contact">
            {t("agencyAction")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <WorkProcess />
      <ContactCTA />
    </div>
  );
}
