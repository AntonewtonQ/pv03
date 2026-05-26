import { Briefcase, GraduationCap, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

const Career = () => {
  const t = useTranslations("About.career");

  const experienceKeys = [
    "espaes",
    "anda",
    "compllexus",
    "rising",
    "illustra",
  ] as const;

  const items = [
    ...experienceKeys.map((key) => ({
      icon: key === "illustra" ? Rocket : Briefcase,
      title: t(`experience.${key}.title`),
      company: t(`experience.${key}.company`),
      date: t(`experience.${key}.date`),
      description: t(`experience.${key}.description`),
    })),
    {
      icon: GraduationCap,
      title: t("education.title"),
      company: t("education.company"),
      date: t("education.date"),
      description: t("education.description"),
    },
  ];

  return (
    <section className="border-y border-white/10 py-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-300">
            {t("eyebrow")}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-white">{t("title")}</h3>
        </div>

        <div className="space-y-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={`${item.company}-${item.title}`}
                className="grid gap-4 sm:grid-cols-[40px_1fr]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-emerald-300">
                  <Icon size={18} />
                </div>
                <div className="space-y-2 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-zinc-400">{item.company}</p>
                  <p className="text-xs uppercase text-zinc-500">{item.date}</p>
                  <p className="text-sm leading-7 text-zinc-300">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Career;
