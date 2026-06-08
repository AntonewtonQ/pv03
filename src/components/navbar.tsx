"use client";

import { ChevronLeft, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import LanguageSwitch from "./language-switch";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks } from "@/constants/navlinks";
import { PresentationModeButton } from "./presentation-mode";

const NavBar = () => {
  const pathname = usePathname();
  const t = useTranslations("Menu");

  return (
    <header
      data-presentation-hide
      className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-h-10 items-center gap-3 text-sm font-bold text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
              aq
            </span>
            <span className="hidden sm:inline">antonewtonquima</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <Link href="/">
                <ChevronLeft />
                {t("back")}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
              title="Admin"
              aria-label="Admin"
            >
              <Link href="/admin">
                <Shield size={16} />
              </Link>
            </Button>
            <PresentationModeButton />
            <LanguageSwitch />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className={`h-9 shrink-0 border px-3 text-xs ${
                  isActive
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Link href={link.href}>{t(link.labelKey)}</Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
