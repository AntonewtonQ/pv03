import { useTranslations } from "next-intl";
import React from "react";

const ProjectList = () => {
  const t = useTranslations("Projects");
  return (
    <div className="text-white px-6 md:px-14 py-6">
      <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
        <div className="space-y-4 mb-2">
          <h1 className="font-bold text-4xl"> {t("title")} </h1>
          <p className="text-muted-foreground max-w-2xl">{t("subtitle")}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
