import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Briefcase } from "lucide-react";
import { Button } from "./ui/button";

const AboutAcordion = () => {
  return (
    <div>
      <Accordion type="single" collapsible className="w-64 border-none">
        <AccordionItem value="item-1" className="border-none">
          <Button className="bg-black">
            <AccordionTrigger className="no-underline">
              Show previous roles
            </AccordionTrigger>
          </Button>
          <AccordionContent className="my-4 space-y-4">
            <div className="s">
              <p className="font-bold text-base flex gap-2">
                <span>Front-end Developer</span>
              </p>
              <p className="text-muted-foreground ">Freelancer</p>
              <p className="text-muted-foreground">January 2024 – Present</p>
            </div>
            <div className="">
              <p className="font-bold text-base flex gap-2">
                <span>Front-end Developer</span>
              </p>
              <p className="text-muted-foreground ">Freelancer</p>
              <p className="text-muted-foreground">January 2024 – Present</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutAcordion;
