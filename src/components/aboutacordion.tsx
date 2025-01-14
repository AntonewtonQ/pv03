"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const AboutAcordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-64 border-none"
        onValueChange={(value) => handleAccordionChange(value == "item-1")}
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="no-underline bg-black">
            {isOpen ? "Hide previoes roles" : "Show previous roles"}
          </AccordionTrigger>

          <AccordionContent className="my-4 space-y-4">
            <div className="">
              <p className="text-muted-foreground">Nothing to present</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutAcordion;
