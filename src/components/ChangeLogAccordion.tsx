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
      className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
    >
      {versions.map((version) => (
        <AccordionItem
          key={version}
          value={version}
          className="border-white/10 last:border-b-0"
        >
          <AccordionTrigger className="rounded-none px-5 py-5 text-left hover:bg-white/[0.04]">
            <span className="flex flex-col gap-1">
              <span className="text-lg font-bold text-white md:text-xl">
                {t(`version.${version}.title`)}
              </span>
              <span className="text-sm text-zinc-500">
                {t(`version.${version}.date`)}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-5 pb-5 text-sm leading-7 text-zinc-300">
            {t(`version.${version}.description`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChangeLogAccordion;
