import PageFrame from "@/components/page-frame";
import SectionHeading from "@/components/section-heading";
import { useTranslations } from "next-intl";

const SetupPage = () => {
  const t = useTranslations("Setup");

  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="border-y border-white/[0.08] py-12">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("description")}
          />
        </div>
      </section>
    </PageFrame>
  );
};

export default SetupPage;
