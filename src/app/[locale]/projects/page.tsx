import PageFrame from "@/components/page-frame";
import ProjectList from "@/components/projectlist";
import ProjectsPage from "@/components/projects";
import ContactCTA from "@/components/contact-cta";
import { getProjectsResult } from "@/lib/projects-server";
import { pageMetadata } from "@/lib/page-metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata((await params).locale, "projects");
}
export default async function ProjectPage() {
  const { projects, error } = await getProjectsResult();
  return (
    <PageFrame>
      <ProjectList />
      <ProjectsPage projects={projects} error={error} />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ContactCTA />
      </div>
    </PageFrame>
  );
}
