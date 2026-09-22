import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import PageFrame from "@/components/page-frame";
import ProjectShareButton from "@/components/project-share-button";
import ProjectCover from "@/components/project-cover";
import { getProjectStory } from "@/lib/project-stories";
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

  const story = getProjectStory(id, locale);
  const canonicalPath = `/${locale}/projects/${id}`;

  return {
    title: project.name,
    description: story?.summary || project.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/projects/${id}`,
        pt: `/pt/projects/${id}`,
      },
    },
    openGraph: {
      images: [
        {
          url: `${canonicalPath}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
      type: "website",
      title: project.name,
      description: story?.summary || project.description,
      url: canonicalPath,
      siteName: "Antonewton Quima",
    },
    twitter: {
      images: [`${canonicalPath}/twitter-image`],
      card: "summary_large_image",
      title: project.name,
      description: story?.summary || project.description,
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

  const story = getProjectStory(id, locale);
  const projectUrl = absoluteUrl(`/${locale}/projects/${id}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: story?.summary || project.description,
    image: project.cover || undefined,
    url: projectUrl,
    dateCreated: project.year || undefined,
    author: story
      ? {
          "@type": "Person",
          name: "Antonewton Quima",
          url: absoluteUrl(`/${locale}`),
        }
      : undefined,
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
            <ProjectCover
              src={project.cover}
              name={project.name}
              fallback={t("noCover")}
            />

            <div className="space-y-6">
              <div className="space-y-5 border-y border-white/[0.08] py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-technical text-[11px] uppercase tracking-[0.16em] text-orange-400">
                    {project.year}
                  </span>
                  <span className="font-technical text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                    {story ? t("personal") : t("eyebrow")}
                  </span>
                </div>
                <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
                  {project.name}
                </h1>
                <p className="text-sm leading-7 text-zinc-400">
                  {story?.summary || project.description}
                </p>
              </div>

              {story && (
                <div className="border-l border-orange-400/60 pl-4">
                  <p className="text-xs text-zinc-400">{t("roleLabel")}</p>
                  <p className="mt-2 text-sm">{t("role")}</p>
                  <p className="mt-3 text-xs leading-6 text-zinc-400">
                    {t("demoNote")}
                  </p>
                </div>
              )}
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
                  text={story?.summary || project.description}
                  shareLabel={t("share")}
                  copiedLabel={t("copied")}
                />
              </div>

              <p className="border-t border-white/10 pt-5 text-xs leading-6 text-zinc-400">
                {t("shareHint")}
              </p>
            </div>
          </div>
          {story && (
            <div className="grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
              <section>
                <h2 className="text-xl font-medium">{t("context")}</h2>
                <p className="mt-4 text-base leading-8 text-zinc-300">
                  {story.context}
                </p>
                <h2 className="mt-8 text-xl font-medium">{t("solution")}</h2>
                <p className="mt-4 text-base leading-8 text-zinc-300">
                  {story.solution}
                </p>
              </section>
              <section>
                <h2 className="text-xl font-medium">{t("features")}</h2>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8 text-zinc-300">
                  {story.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}
          <section className="border-t border-orange-400/40 py-8">
            <h2 className="text-2xl font-medium">{t("contact")}</h2>
            <Link href="/contact" className="primary-cta mt-6">
              {t("contactAction")}
              <ExternalLink size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </article>
    </PageFrame>
  );
}
