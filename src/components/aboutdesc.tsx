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
      <div className="mx-auto max-w-6xl space-y-16">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-10 border-y border-white/[0.08] py-10 lg:grid-cols-[300px_1fr] lg:items-center lg:gap-14">
          <div className="relative mx-auto w-full max-w-[300px]">
            <span
              className="absolute -bottom-3 -left-3 h-20 w-20 border-b border-l border-orange-400/70"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#0d0c09]">
              <Image
                src="/my-avatar.png"
                fill
                sizes="(min-width: 1024px) 300px, 100vw"
                alt="Antonewton Quima"
                className="scale-[0.88] object-contain"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-technical text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
                {t("introduction.title")}
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold leading-snug tracking-[-0.03em] text-white md:text-4xl">
                {t("introduction.subtitle")}
              </h2>
              <div className="max-w-3xl space-y-4 text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
                <p>{t("introduction.description")}</p>
                <p>{t("introduction.description2")}</p>
              </div>
            </div>

            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {curiosities.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="min-h-24 border-t border-white/[0.1] py-4 transition hover:border-orange-400/50"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon size={17} className="text-orange-400" />
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <section className="border-t border-white/[0.08] py-8">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <Code2 size={18} className="text-orange-400" />
                {t("toolkit.title")}
              </div>
              <p className="text-sm leading-7 text-zinc-400">
                {t("toolkit.description")}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-technical border-b border-white/10 pb-1 text-[11px] text-zinc-400"
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
