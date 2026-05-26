import {
  Code2,
  Film,
  FlameKindling,
  Laptop,
  MapPin,
  Music,
  Pizza,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Career from "./career";
import SectionHeading from "./section-heading";

const AboutDesc = () => {
  const t = useTranslations("About");

  const curiosities = [
    { icon: Music, title: t("curiosity.music.title"), text: t("curiosity.music.description") },
    { icon: MapPin, title: t("curiosity.city.title"), text: t("curiosity.city.description") },
    { icon: Film, title: t("curiosity.interests.title"), text: t("curiosity.interests.description") },
    { icon: FlameKindling, title: t("curiosity.ministry.title"), text: t("curiosity.ministry.description") },
    { icon: Pizza, title: t("curiosity.food.title"), text: t("curiosity.food.description") },
    { icon: Laptop, title: t("curiosity.system.title"), text: t("curiosity.system.description") },
  ];

  const skills = [
    "Odoo",
    "Python",
    "XML/QWeb",
    "JavaScript",
    "PostgreSQL",
    "REST APIs",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "React",
    "Zabbix",
    "Grafana",
  ];

  return (
    <section className="px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-8 border-y border-white/10 py-8 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <Image
              src="/my-avatar.png"
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              alt="Antonewton Quima"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-emerald-300">
                {t("introduction.title")}
              </p>
              <h2 className="max-w-3xl text-2xl font-bold leading-snug text-white md:text-3xl">
                {t("introduction.subtitle")}
              </h2>
              <div className="space-y-4 text-sm leading-7 text-zinc-300 md:text-base">
                <p>{t("introduction.description")}</p>
                <p>{t("introduction.description2")}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {curiosities.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="min-h-28 rounded-md border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon size={18} className="text-amber-300" />
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="border-y border-white/10 py-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Code2 size={18} className="text-emerald-300" />
                {t("toolkit.title")}
              </div>
              <p className="text-sm leading-7 text-zinc-400">
                {t("toolkit.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <Career />
        </div>
      </div>
    </section>
  );
};

export default AboutDesc;
