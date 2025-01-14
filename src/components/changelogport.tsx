import React from "react";
import ChangeLogAccordion from "./ChangeLogAccordion";

const ChangeLogPort = () => {
  return (
    <div className="text-white px-6 md:px-14 py-6">
      <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
        <div className="space-y-4 mb-2">
          <h1 className="font-bold text-3xl lg:text-4xl">Changelog</h1>
          <p className="text-muted-foreground max-w-2xl lg:text-xl">
            Track the evolution of my portfolio with detailed updates and
            improvements.
          </p>
        </div>
        <div className="">
          <ChangeLogAccordion />
        </div>
      </div>
    </div>
  );
};

export default ChangeLogPort;
