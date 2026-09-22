import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { socialLinks } from "@/constants/navlinks";
import { PresentationModeButton } from "./presentation-mode";
export default function Footer() {
  const t = useTranslations("Menu");
  const home = useTranslations("Home");
  return (
    <footer data-presentation-hide className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <Link href="/" className="text-lg font-medium">
              Antonewton Quima
            </Link>
            <p className="mt-3 text-xs leading-6 text-zinc-400">
              {home("location")}
            </p>
            <a
              className="mt-2 inline-flex min-h-11 items-center break-all text-sm text-zinc-300 hover:text-orange-300"
              href="mailto:antonewtonquima@gmail.com"
            >
              antonewtonquima@gmail.com
            </a>
          </div>
          <div className="flex flex-wrap gap-x-5">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-sm text-zinc-300 hover:text-orange-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Antonewton Quima
          </p>
          <nav
            aria-label={t("footerNavigation")}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {[
              { href: "/now", label: t("nowlink") },
              { href: "/shop", label: t("shoplink") },
              { href: "/versions", label: t("versionslink") },
              { href: "/admin", label: t("admin") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-xs text-zinc-400 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <PresentationModeButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
