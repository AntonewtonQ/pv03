import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "./section-heading";
export default function ContactList() {
  const t = useTranslations("Contact");
  return (
    <section className="px-6 pt-10 md:px-10 md:pt-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <a
          href="mailto:antonewtonquima@gmail.com"
          className="group flex flex-wrap items-center gap-3 border-y border-white/15 py-6 text-base text-zinc-200 hover:text-orange-300"
        >
          <Mail className="text-orange-400" size={22} aria-hidden="true" />
          <span className="break-all">antonewtonquima@gmail.com</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
