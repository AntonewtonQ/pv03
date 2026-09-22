import PageFrame from "@/components/page-frame";
import Menu from "@/components/menu";
import { getProjectsResult } from "@/lib/projects-server";
import { featuredProjectIds } from "@/lib/project-stories";
import { pageMetadata } from "@/lib/page-metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata((await params).locale, "home");
}
export default async function Home() {
  const { projects, error } = await getProjectsResult();
  const featured = featuredProjectIds
    .flatMap((id) => projects.filter((project) => project.id === id))
    .slice(0, 3);
  return (
    <PageFrame>
      <Menu projects={featured} projectsError={error} />
    </PageFrame>
  );
}
