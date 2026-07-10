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
    <section className="border-t border-white/[0.08] py-8">
      <div className="space-y-6">
        <div>
          <p className="font-technical text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
            {t("eyebrow")}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
            {t("title")}
          </h3>
        </div>

        <div>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={`${item.company}-${item.title}`}
                className="grid gap-4 border-t border-white/[0.08] py-5 sm:grid-cols-[40px_1fr]"
              >
                <div className="flex h-9 w-9 items-center justify-center border border-orange-400/35 text-orange-400">
                  <Icon size={18} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-zinc-400">{item.company}</p>
                  <p className="font-technical text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                    {item.date}
                  </p>
                  <p className="text-sm leading-7 text-zinc-400">
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
