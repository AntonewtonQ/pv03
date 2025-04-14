import Footer from "@/components/footer";
import Layout from "@/components/layout";
import NavBar from "@/components/navbar";
import ProjectList from "@/components/projectlist";
import ProjectsPage from "@/components/projects";
import React from "react";

const ProjectPage = () => {
  return (
    <Layout>
      <div>
        <NavBar />
        <ProjectList />
        <ProjectsPage />
        <Footer />
      </div>
    </Layout>
  );
};

export default ProjectPage;
