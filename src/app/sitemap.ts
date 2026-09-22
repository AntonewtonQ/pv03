import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects-server";
import { SITE_URL } from "@/lib/site";

const locales = ["en", "pt"] as const;
const staticRoutes = ["", "/about", "/projects", "/now", "/shop", "/contact"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${route}`,
          pt: `${SITE_URL}/pt${route}`,
        },
      },
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/projects" ? 0.9 : 0.7,
    })),
  );
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/projects/${project.id}`,
      alternates: {
        languages: {
          en: `${SITE_URL}/en/projects/${project.id}`,
          pt: `${SITE_URL}/pt/projects/${project.id}`,
        },
      },
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...projectEntries];
}
