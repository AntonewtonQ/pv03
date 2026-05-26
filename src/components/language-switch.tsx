"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  className?: string;
};

const LanguageSwitch = ({ className }: LanguageSwitchProps) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "en" ? "pt" : "en";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => router.push(pathname, { locale: nextLocale })}
      className={cn(
        "h-9 border border-white/10 bg-white/[0.03] px-3 text-xs uppercase text-zinc-300 hover:bg-white/10 hover:text-white",
        className
      )}
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
    >
      <Languages />
      {nextLocale}
    </Button>
  );
};

export default LanguageSwitch;
