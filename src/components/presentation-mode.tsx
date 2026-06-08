"use client";

import {
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { navLinks } from "@/constants/navlinks";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const STORAGE_KEY = "portfolio-presentation-mode";

interface PresentationModeContextValue {
  active: boolean;
  start: () => void;
  stop: () => void;
}

const PresentationModeContext =
  createContext<PresentationModeContextValue | null>(null);

const setPresentationState = (active: boolean) => {
  document.body.dataset.presentation = active ? "true" : "false";
  sessionStorage.setItem(STORAGE_KEY, active ? "true" : "false");
};

export function PresentationModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Presentation");
  const menu = useTranslations("Menu");
  const [active, setActive] = useState(false);

  const currentIndex = useMemo(() => {
    const index = navLinks.findIndex((link) => link.href === pathname);
    return index === -1 ? 0 : index;
  }, [pathname]);

  const stop = useCallback(() => {
    setActive(false);
    setPresentationState(false);

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  const start = useCallback(() => {
    setActive(true);
    setPresentationState(true);

    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const destination = navLinks[index];

      if (destination) {
        router.push(destination.href);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [router]
  );

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setActive(true);
      setPresentationState(true);
    }

    return () => {
      document.body.dataset.presentation = "false";
    };
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        goTo(currentIndex - 1);
      }

      if (event.key === "ArrowRight" && currentIndex < navLinks.length - 1) {
        goTo(currentIndex + 1);
      }

      if (event.key === "Escape") {
        stop();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [active, currentIndex, goTo, stop]);

  const value = useMemo(
    () => ({
      active,
      start,
      stop,
    }),
    [active, start, stop]
  );

  return (
    <PresentationModeContext.Provider value={value}>
      {children}

      {active ? (
        <div
          className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 rounded-md border border-white/15 bg-black/90 p-1.5 shadow-2xl backdrop-blur-xl"
          aria-label={t("controls")}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="h-9 w-9 text-zinc-300 hover:bg-white/10 hover:text-white"
            title={t("previous")}
            aria-label={t("previous")}
          >
            <ChevronLeft />
          </Button>

          <div
            className="min-w-28 px-3 text-center"
            aria-live="polite"
          >
            <p className="truncate text-xs font-medium text-white">
              {menu(navLinks[currentIndex].labelKey)}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {currentIndex + 1} / {navLinks.length}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === navLinks.length - 1}
            className="h-9 w-9 text-zinc-300 hover:bg-white/10 hover:text-white"
            title={t("next")}
            aria-label={t("next")}
          >
            <ChevronRight />
          </Button>

          <span className="mx-1 h-6 w-px bg-white/10" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={stop}
            className="h-9 w-9 text-zinc-300 hover:bg-white/10 hover:text-white"
            title={t("stop")}
            aria-label={t("stop")}
          >
            <X />
          </Button>
        </div>
      ) : null}
    </PresentationModeContext.Provider>
  );
}

export function PresentationModeButton({
  className,
}: {
  className?: string;
}) {
  const context = useContext(PresentationModeContext);
  const t = useTranslations("Presentation");

  if (!context || context.active) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={context.start}
      className={cn(
        "h-9 w-9 border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white",
        className
      )}
      title={t("start")}
      aria-label={t("start")}
    >
      <MonitorPlay />
    </Button>
  );
}
