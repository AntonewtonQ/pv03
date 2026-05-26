import { useTranslations } from "next-intl";
import ChangeLogAccordion from "./ChangeLogAccordion";
import SectionHeading from "./section-heading";

const ChangeLogPort = () => {
  const t = useTranslations("Version");

  return (
    <section className="px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("description")}
        />
        <ChangeLogAccordion />
      </div>
    </section>
  );
};

export default ChangeLogPort;
