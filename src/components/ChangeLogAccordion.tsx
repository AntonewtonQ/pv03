import React from "react";
import { Accordion, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Separator } from "./ui/separator";

const ChangeLogAccordion = () => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className=" border w-full rounded-lg p-2 lg:p-6 border-muted-foreground overflow-hidden"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="no-underline bg-black flex justify-between hover:bg-none ">
            <p className="flex flex-col">
              <span className="text-white text-xl lg:text-2xl font-bold">
                Version 3.0
              </span>
              <span className="text-base text-muted-foreground">
                14 de Jan de 2025
              </span>
            </p>
          </AccordionTrigger>

          <AccordionContent className="my-4 space-y-4 transition-all duration-300 ease-in-out">
            <Separator className="my-4 " />
            <div className="">
              <p className="text-white text-sm lg:text-base">
                Created a new portfolio inpired by birobiro, integrating the
                latest technologies (Next.js, Tailwind CSS, shadcn/ui, etc.).
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChangeLogAccordion;
