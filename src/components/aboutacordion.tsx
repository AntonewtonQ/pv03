"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const AboutAcordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="roles" className="border-white/10">
        <AccordionTrigger className="rounded-md bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white">
          Previous roles
        </AccordionTrigger>
        <AccordionContent className="text-zinc-400">
          Nothing to present yet.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AboutAcordion;
