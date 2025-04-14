// components/ProjectCard.tsx
import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
  name: string;
  description: string;
  year: string;
  cover: string;
}

export default function ProjectCard({
  name,
  description,
  year,
  cover,
}: ProjectCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 text-white w-[300px] shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative w-full h-[180px]">
        <Image src={cover} alt={name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h3 className="text-white text-center text-lg font-bold">
            CUSTOM K MOTOS
          </h3>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-1">{name}</h4>
        <p className="text-sm text-zinc-400">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">
            {year}
          </span>
          {hover && (
            <span className="text-sm text-blue-400 font-medium hover:underline cursor-pointer">
              View project
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
