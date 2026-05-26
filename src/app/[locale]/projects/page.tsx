import PageFrame from "@/components/page-frame";
import ProjectList from "@/components/projectlist";
import ProjectsPage from "@/components/projects";

const ProjectPage = () => {
  return (
    <PageFrame>
      <ProjectList />
      <ProjectsPage />
    </PageFrame>
  );
};

export default ProjectPage;
