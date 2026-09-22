import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
export default function ContactCTA() {
  const t = useTranslations("Home");
  return (
    <section className="border-t border-orange-400/40 py-16 md:py-20">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="eyebrow">{t("primaryAction")}</p>
          <h2 className="section-title mt-4">{t("contactTitle")}</h2>
        </div>
        <div>
          <p className="text-base leading-8 text-zinc-300">
            {t("contactText")}
          </p>
          <Link className="primary-cta mt-6" href="/contact">
            {t("primaryAction")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <p className="mt-8 text-sm text-zinc-400">
        {t("emailLabel")}{" "}
        <a
          className="break-all text-zinc-200 underline decoration-white/30 underline-offset-4 hover:text-orange-300"
          href="mailto:antonewtonquima@gmail.com"
        >
          antonewtonquima@gmail.com
        </a>
      </p>
    </section>
  );
}
