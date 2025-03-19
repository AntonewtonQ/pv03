import React from "react";
import { Separator } from "./ui/separator";
import AboutAcordion from "./aboutacordion";
import { Briefcase } from "lucide-react";

const Career = () => {
  return (
    <div>
      <div className="border border-muted-foreground rounded-xl px-10 md:px-14 py-10 flex flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="font-bold text-base mb-6">Career</h3>
          <div className="space-y-2">
            <p className="font-bold text-base flex gap-2">
              <Briefcase />
              <span>Front-end Developer</span>
            </p>
            <p className="text-muted-foreground ">Freelancer</p>
            <p className="text-muted-foreground">January 2024 – Present</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          {/**ACCORDION */}
          <AboutAcordion />
        </div>
      </div>
    </div>
  );
};

export default Career;
