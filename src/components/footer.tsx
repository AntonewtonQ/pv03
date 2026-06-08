import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer data-presentation-hide className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-10">
        <p>{t("copyright")}</p>
        <Link
          href="/versions"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          v4.0
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
