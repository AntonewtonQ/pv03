import { Globe2, PanelsTopLeft, Workflow, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Services() {
  const t = useTranslations("Services");
  const home = useTranslations("Home");
  return (
    <section
      id="services"
      className="scroll-mt-36 border-t border-white/10 py-16 md:py-24"
    >
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 className="section-title mt-4">{t("title")}</h2>
      <p className="mt-5 max-w-2xl text-zinc-400">{t("description")}</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
        {(
          [
            { key: "web", icon: Globe2 },
            { key: "apps", icon: PanelsTopLeft },
            { key: "odoo", icon: Workflow },
          ] as const
        ).map(({ key, icon: Icon }) => (
          <article
            key={key}
            className="flex flex-col border-t border-orange-400/40 pt-6"
          >
            <Icon
              className="mb-6 text-orange-400"
              size={26}
              aria-hidden="true"
            />
            <h3 className="max-w-xs text-2xl font-medium tracking-tight">
              {t(`${key}Title`)}
            </h3>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {t(`${key}Text`)}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-400">
              {(t.raw(`${key}Items`) as string[]).map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-orange-400">
                    ↳
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <Link href="/contact" className="text-link mt-10">
        {home("primaryAction")}
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
