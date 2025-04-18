"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectCard from "./projectcard";
import { Button } from "./ui/button";

interface Project {
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

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

  // Pegando anos únicos
  const years = Array.from(
    new Set(projects.map((project) => project.year))
  ).sort();

  // Filtrar projetos baseado no ano selecionado
  const filteredProjects = selectedYear
    ? projects.filter((project) => project.year === selectedYear)
    : projects;

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-6 mx-auto justify-center">
      <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6 mb-6">
        {/* Área de controles: lista dos anos */}
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"} // estiliza botão selecionado
              onClick={() => setSelectedYear(year)}
              className="bg-black border border-muted-foreground text-white rounded font-bold"
            >
              {year}
            </Button>
          ))}
          {/* Botão para limpar filtro */}
          {selectedYear && (
            <Button
              onClick={() => setSelectedYear(null)}
              className="bg-white text-black rounded font-bold"
            >
              All
            </Button>
          )}
        </div>
      </div>

      {/* Grid de projetos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto px-10 max-w-6xl">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No project found.
          </div>
        )}
      </div>
    </main>
  );
}
