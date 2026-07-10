import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import PageFrame from "@/components/page-frame";
import ProjectShareButton from "@/components/project-share-button";
import ProjectStatusBadge from "@/components/project-status-badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getProject } from "@/lib/projects-server";
import { absoluteUrl } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Project not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/${locale}/projects/${id}`;

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/projects/${id}`,
        pt: `/pt/projects/${id}`,
      },
    },
    openGraph: {
      type: "website",
      title: project.name,
      description: project.description,
      url: canonicalPath,
      siteName: "Antonewton Quima",
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = await params;
  const [project, t] = await Promise.all([
    getProject(id),
    getTranslations({ locale, namespace: "ProjectDetail" }),
  ]);

  if (!project) {
    notFound();
  }

  const cover = project.cover || "/images/cover.png";
  const projectUrl = absoluteUrl(`/${locale}/projects/${id}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    image: project.cover || absoluteUrl("/images/cover.png"),
    url: projectUrl,
    dateCreated: project.year || undefined,
    author: {
      "@type": "Person",
      name: "Antonewton Quima",
      url: absoluteUrl(`/${locale}`),
    },
    sameAs: project.link || undefined,
  };

  return (
    <PageFrame>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <article className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <Button
            asChild
            variant="ghost"
            className="h-10 border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <Link href="/projects">
              <ArrowLeft />
              {t("back")}
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div className="overflow-hidden border border-white/[0.08] bg-zinc-950">
              <img
                src={cover}
                alt={project.name}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-5 border-y border-white/[0.08] py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-technical text-[11px] uppercase tracking-[0.16em] text-orange-400">
                    {project.year}
                  </span>
                  <ProjectStatusBadge
                    projectId={project.id}
                    hasLink={Boolean(project.link)}
                  />
                  <span className="font-technical text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                    {t("eyebrow")}
                  </span>
                </div>
                <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
                  {project.name}
                </h1>
                <p className="text-sm leading-7 text-zinc-400">
                  {project.description}
                </p>
              </div>

              <div className="grid gap-3">
                {project.link ? (
                  <Button
                    asChild
                    className="h-12 justify-between rounded-sm bg-orange-500 px-5 text-sm font-semibold text-black shadow-none hover:bg-orange-400"
                  >
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {t("visit")}
                      <ExternalLink />
                    </a>
                  </Button>
                ) : null}

                <ProjectShareButton
                  title={project.name}
                  text={project.description}
                  shareLabel={t("share")}
                  copiedLabel={t("copied")}
                />
              </div>

              <p className="border-t border-white/10 pt-5 text-xs leading-6 text-zinc-600">
                {t("shareHint")}
              </p>
            </div>
          </div>
        </div>
      </article>
    </PageFrame>
  );
}
