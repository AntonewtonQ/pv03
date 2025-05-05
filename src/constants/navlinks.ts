import { useTranslations } from "next-intl";

const t = useTranslations("Menu");

  export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: `${t("aboutlink")}` },
    { href: "/projects", label: `${t("projectslink")}` },
    { href: "/shop", label: `${t("shoplink")}` },
    { href: "/contact", label: `${t("contactlink")}` },
  ];