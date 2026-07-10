import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer data-presentation-hide className="border-t border-white/[0.08]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-10">
        <p>{t("copyright")}</p>
        <Link
          href="/versions"
          className="font-technical inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-zinc-400 transition hover:text-orange-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          v4.0
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
