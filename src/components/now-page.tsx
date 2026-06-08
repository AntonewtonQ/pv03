"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {
  BookOpen,
  CalendarDays,
  Code2,
  ExternalLink,
  Focus,
  Loader2,
  MapPin,
  Radio,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { db } from "@/lib/firebase";
import { emptyNowContent, toNowContent, type NowContent } from "@/lib/now";
import SectionHeading from "./section-heading";
import { Button } from "./ui/button";

const splitLines = (value: string) => {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

export default function NowPage() {
  const t = useTranslations("Now");
  const [content, setContent] = useState<NowContent>(emptyNowContent);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    const loadNow = async () => {
      try {
        const snapshot = await getDoc(doc(db, "now", "current"));
        setContent(snapshot.exists() ? toNowContent(snapshot.data()) : emptyNowContent);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    void loadNow();
  }, []);

  const sections = useMemo(
    () => [
      {
        title: t("focus"),
        icon: Focus,
        lines: splitLines(content.focus),
      },
      {
        title: t("building"),
        icon: Code2,
        lines: splitLines(content.building),
      },
      {
        title: t("learning"),
        icon: BookOpen,
        lines: splitLines(content.learning),
      },
    ],
    [content.building, content.focus, content.learning, t]
  );

  const hasContent = Boolean(
    content.headline ||
      content.summary ||
      content.focus ||
      content.building ||
      content.learning ||
      content.projectLink ||
      content.projectCover
  );

  return (
    <>
      <section className="px-6 pt-10 md:px-10 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={content.headline || t("title")}
            subtitle={content.summary || t("subtitle")}
          />
        </div>
      </section>

      <section className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {status === "loading" ? (
            <div className="flex items-center gap-3 border-y border-white/10 py-6 text-sm text-zinc-400">
              <Loader2 className="animate-spin text-emerald-300" size={17} />
              {t("loading")}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-5 text-sm text-amber-100">
              {t("error")}
            </div>
          ) : null}

          {status === "ready" && !hasContent ? (
            <div className="border-y border-white/10 py-10 text-sm leading-7 text-zinc-400">
              {t("empty")}
            </div>
          ) : null}

          {status === "ready" && hasContent ? (
            <>
              <div className="grid gap-3 border-y border-white/10 py-5 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Radio size={17} className="text-emerald-300" />
                  <div>
                    <p className="text-xs text-zinc-500">{t("availability")}</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {content.availability || t("notInformed")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-emerald-300" />
                  <div>
                    <p className="text-xs text-zinc-500">{t("location")}</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {content.location || t("notInformed")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays size={17} className="text-emerald-300" />
                  <div>
                    <p className="text-xs text-zinc-500">{t("updated")}</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {content.updatedAt
                        ? new Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(content.updatedAt))
                        : t("notInformed")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <article
                      key={section.title}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                          <Icon size={17} />
                        </span>
                        <h2 className="text-base font-bold text-white">
                          {section.title}
                        </h2>
                      </div>
                      {section.lines.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                          {section.lines.map((line) => (
                            <li
                              key={line}
                              className="flex gap-3 text-sm leading-6 text-zinc-400"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-zinc-600">
                          {t("notInformed")}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>

              {content.projectLink || content.projectCover ? (
                <div className="space-y-5 border-y border-white/10 py-5">
                  {content.projectCover ? (
                    content.projectLink ? (
                      <a
                        href={content.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="group block aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-zinc-950"
                      >
                        <img
                          src={content.projectCover}
                          alt={content.projectName || t("currentProjectFallback")}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      </a>
                    ) : (
                      <div className="aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                        <img
                          src={content.projectCover}
                          alt={content.projectName || t("currentProjectFallback")}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )
                  ) : null}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">
                        {t("currentProject")}
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        {content.projectName || t("currentProjectFallback")}
                      </p>
                    </div>
                    {content.projectLink ? (
                      <Button
                        asChild
                        className="h-10 justify-between rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-zinc-200"
                      >
                        <a
                          href={content.projectLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("accessProject")}
                          <ExternalLink size={16} />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
