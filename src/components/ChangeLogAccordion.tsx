import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ChangeLogAccordion = () => {
  const t = useTranslations("Version");
  const versions = ["four", "three"] as const;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="four"
      className="w-full overflow-hidden border-y border-white/[0.08]"
    >
      {versions.map((version) => (
        <AccordionItem
          key={version}
          value={version}
          className="border-white/[0.08] last:border-b-0"
        >
          <AccordionTrigger className="rounded-none px-1 py-6 text-left hover:bg-white/[0.025]">
            <span className="flex flex-col gap-1">
              <span className="text-lg font-semibold tracking-[-0.02em] text-white md:text-xl">
                {t(`version.${version}.title`)}
              </span>
              <span className="font-technical text-[11px] uppercase tracking-[0.12em] text-orange-400">
                {t(`version.${version}.date`)}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-1 pb-6 text-sm leading-7 text-zinc-400">
            {t(`version.${version}.description`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChangeLogAccordion;
