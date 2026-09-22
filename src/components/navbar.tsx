"use client";

import { useTranslations } from "next-intl";
import LanguageSwitch from "./language-switch";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks } from "@/constants/navlinks";

const NavBar = () => {
  const pathname = usePathname();
  const t = useTranslations("Menu");

  return (
    <header
      data-presentation-hide
      className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#090806]/90 backdrop-blur-xl"
    >
      <a href="#main-content" className="skip-link">
        {t("skip")}
      </a>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex min-h-10 items-center gap-3 text-sm font-semibold text-white"
          >
            <span className="font-technical flex h-8 w-8 items-center justify-center border border-orange-400/50 bg-orange-500 text-xs font-bold text-black transition group-hover:bg-orange-400">
              aq
            </span>
            <span className="hidden tracking-[-0.02em] sm:inline">
              antonewton quima
            </span>
          </Link>

          <nav
            aria-label={t("navigation")}
            className="hidden h-full items-stretch lg:flex"
          >
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/projects" &&
                  pathname.startsWith("/projects/"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-technical relative flex items-center px-3 text-[11px] uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "text-orange-300 after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-orange-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
          </div>
        </div>

        <nav
          aria-label={t("navigation")}
          className="-mx-1 flex overflow-x-auto border-t border-white/[0.06] lg:hidden"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/projects" && pathname.startsWith("/projects/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-technical relative shrink-0 px-2.5 py-3.5 text-[11px] uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "text-orange-300 after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-orange-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
