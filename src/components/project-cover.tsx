"use client";
import { useState } from "react";
export default function ProjectCover({
  src,
  name,
  fallback,
}: {
  src: string;
  name: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#11100d]">
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-xl text-zinc-300">{name}</span>
          <span className="text-sm text-zinc-400">{fallback}</span>
        </div>
      )}
    </div>
  );
}
