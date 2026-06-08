"use client";

import {
  ArrowRight,
  Building2,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import LanguageSwitch from "./language-switch";
import { Link } from "@/i18n/navigation";
import { navLinks } from "@/constants/navlinks";
import { PresentationModeButton } from "./presentation-mode";

const Menu = () => {
  const t = useTranslations("Menu");
  const home = useTranslations("Home");

  const stats = [
    { value: "03+", label: home("stats.projects") },
    { value: "03", label: home("stats.schools") },
    { value: "v4.0", label: home("stats.version") },
  ];

  const focusAreas = [
    home("focus.frontend"),
    home("focus.products"),
    home("focus.learning"),
  ];

  const socialItems = [
    {
      href: "https://github.com/AntonewtonQ",
      label: "GitHub",
      icon: Github,
    },
    {
      href: "https://www.linkedin.com/in/antonewton-quima-95aaa3238/",
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: "https://instagram.com/antonewton_",
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: "https://www.facebook.com/newton.quima.9/",
      label: "Facebook",
      icon: Facebook,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p className="flex items-center gap-2">
              <Building2 size={16} />
              <span>{t("address")}</span>
            </p>
            <p className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-300" />
              <span>{home("availability")}</span>
            </p>
          </div>
          <div data-presentation-hide className="flex items-center gap-2">
            <PresentationModeButton />
            <LanguageSwitch />
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase text-emerald-300">
                {home("eyebrow")}
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
                  Antonewton Quima
                </h1>
                <p className="text-base text-zinc-400 md:text-lg">
                  {t("role")}
                </p>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                {home("description")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 justify-between rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-zinc-200 sm:w-44"
              >
                <Link href="/projects">
                  {home("primaryAction")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-md border-white/15 bg-black px-4 text-sm text-white hover:bg-white/10 hover:text-white sm:w-44"
              >
                <Link href="/contact">
                  {home("secondaryAction")}
                  <Mail />
                </Link>
              </Button>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-h-24 rounded-md border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
              <Image
                src="/my-avatar.png"
                alt="Antonewton Quima"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="space-y-3 border-y border-white/10 py-5">
              <p className="flex items-center gap-2 text-sm text-zinc-300">
                <MapPin size={16} className="text-amber-300" />
                {home("base")}
              </p>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-8 border-t border-white/10 py-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase text-zinc-500">
              {t("navigation")}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {navLinks
                .filter((link) => link.href !== "/")
                .map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="h-12 justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <Link href={link.href}>
                      {t(link.labelKey)}
                      <ArrowRight />
                    </Link>
                  </Button>
                ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase text-zinc-500">
              {t("social")}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {socialItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={18} />
                      {item.label}
                    </span>
                    <ArrowRight size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 py-4">
          <Button
            asChild
            variant="ghost"
            className="h-9 border border-emerald-300/30 bg-emerald-300/10 text-xs text-emerald-200 hover:bg-emerald-300/15 hover:text-white"
          >
            <Link href="/versions">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              v4.0
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Menu;
