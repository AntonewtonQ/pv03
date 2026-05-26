import { useTranslations } from "next-intl";
import SectionHeading from "./section-heading";

const ShopList = () => {
  const t = useTranslations("Shop");

  return (
    <section className="px-6 pt-10 md:px-10 md:pt-14">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </div>
    </section>
  );
};

export default ShopList;
