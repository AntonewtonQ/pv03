import PageFrame from "@/components/page-frame";
import { useTranslations } from "next-intl";

const SetupPage = () => {
  const t = useTranslations("Setup");

  return (
    <PageFrame>
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="border-y border-white/10 py-12">
          <p className="text-sm uppercase text-emerald-300">{t("eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            {t("description")}
          </p>
        </div>
      </section>
    </PageFrame>
  );
};

export default SetupPage;
