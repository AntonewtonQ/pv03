// app/projects/page.tsx (ou pages/projects.tsx dependendo da tua estrutura)
"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; // garante que você tenha configurado isso
import ProjectCard from "./projectcard";

interface Project {
  name: string;
  description: string;
  year: string;
  cover: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectList = querySnapshot.docs.map(
        (doc) => doc.data() as Project
      );
      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} {...project} />
        ))}
      </div>
    </main>
  );
}
