"use client";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, PanelRight } from "lucide-react";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const t = useTranslations("Menu");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: t("aboutlink") },
    { href: "/projects", label: t("projectslink") },
    { href: "/shop", label: t("shoplink") },
    { href: "/contact", label: t("contactlink") },
  ];

  return (
    <div className="px-6 md:px-14 md:py-6">
      <div className="mx-auto p-6 max-w-6xl flex items-center justify-between">
        <div>
          <Link className="w-full" href="/">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between hover:text-white hover:bg-black">
              <ChevronLeft />
              <span className="capitalize">{t("back")} </span>
            </Button>
          </Link>
        </div>
        <div className="">
          <Button className="lg:hidden text-muted-foreground bg-black hover:text-white hover:bg-black">
            <PanelRight />
          </Button>
          <nav className="hidden overflow-hidden lg:flex">
            {navLinks.map((link) => (
              <Link className="w-full" href={link.href} key={link.label}>
                <Button
                  className={`w-full flex text-start bg-black justify-between hover:text-white hover:bg-black ${
                    pathname == link.href
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
