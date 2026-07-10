"use client";

import {
  ArrowUpRight,
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
    <main className="min-h-screen overflow-hidden text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] py-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-technical flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
            <p className="flex items-center gap-2.5">
              <Building2 size={15} />
              <span>{t("address")}</span>
            </p>
            <p className="flex items-center gap-2.5 text-zinc-300">
              <Sparkles size={15} className="text-orange-400" />
              <span>{home("availability")}</span>
            </p>
          </div>
          <div data-presentation-hide className="flex items-center gap-2">
            <PresentationModeButton />
            <LanguageSwitch />
          </div>
        </div>

        <div className="grid flex-1 items-center gap-14 border-b border-white/[0.08] py-14 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-20 lg:py-20">
          <div>
            <div className="font-technical flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">
              <span className="h-px w-7 bg-orange-400" aria-hidden="true" />
              {home("eyebrow")}
            </div>

            <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,10vw,7.5rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-white">
              <span className="block">Antonewton</span>
              <span className="block text-zinc-300">Quima</span>
            </h1>

            <p className="font-technical mt-8 text-xs uppercase leading-6 tracking-[0.12em] text-zinc-500 md:text-sm">
              {t("role")}
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
              {home("description")}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 justify-between rounded-sm bg-orange-500 px-5 text-sm font-semibold text-black shadow-none hover:bg-orange-400 sm:min-w-44"
              >
                <Link href="/projects">
                  {home("primaryAction")}
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 justify-between rounded-sm border-white/15 bg-transparent px-5 text-sm text-white shadow-none hover:border-white/30 hover:bg-white/[0.05] hover:text-white sm:min-w-44"
              >
                <Link href="/contact">
                  {home("secondaryAction")}
                  <Mail />
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/[0.08]">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`py-5 ${index > 0 ? "border-l border-white/[0.08] pl-4 sm:pl-6" : "pr-4 sm:pr-6"}`}
                >
                  <p className="font-technical text-xl font-semibold text-white sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-32 text-[11px] leading-5 text-zinc-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="mx-auto w-full max-w-[330px] lg:ml-auto">
            <div className="relative">
              <span
                className="absolute -right-3 -top-3 h-20 w-20 border-r border-t border-orange-400/70"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#0d0c09]">
                <span className="font-technical absolute left-4 top-4 z-10 text-[10px] uppercase tracking-[0.18em] text-orange-400">
                  AQ / 04
                </span>
                <Image
                  src="/my-avatar.png"
                  alt="Antonewton Quima"
                  fill
                  priority
                  sizes="330px"
                  className="scale-[0.88] object-contain"
                />
              </div>
            </div>

            <div className="mt-7 border-l border-orange-400 pl-4">
              <p className="flex items-start gap-2.5 text-sm leading-6 text-zinc-300">
                <MapPin size={16} className="mt-1 shrink-0 text-orange-400" />
                {home("base")}
              </p>
            </div>

            <div className="font-technical mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              {focusAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </aside>
        </div>

        <div className="grid border-b border-white/[0.08] lg:grid-cols-2">
          <section className="py-8 lg:border-r lg:border-white/[0.08] lg:pr-10">
            <h2 className="font-technical text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              {t("navigation")}
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 sm:gap-x-8">
              {navLinks
                .filter((link) => link.href !== "/")
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between border-t border-white/[0.08] py-3.5 text-sm text-zinc-300 transition hover:border-orange-400/50 hover:text-white"
                  >
                    {t(link.labelKey)}
                    <ArrowUpRight
                      size={15}
                      className="text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
                    />
                  </Link>
                ))}
            </div>
          </section>

          <section className="border-t border-white/[0.08] py-8 lg:border-t-0 lg:pl-10">
            <h2 className="font-technical text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              {t("social")}
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 sm:gap-x-8">
              {socialItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between border-t border-white/[0.08] py-3.5 text-sm text-zinc-300 transition hover:border-orange-400/50 hover:text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} className="text-zinc-600 group-hover:text-orange-400" />
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
                    />
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between py-5 text-[11px] text-zinc-600">
          <span className="font-technical uppercase tracking-[0.16em]">
            © 2026
          </span>
          <Link
            href="/versions"
            className="font-technical flex items-center gap-2 uppercase tracking-[0.16em] transition hover:text-orange-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            v4.0
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Menu;
