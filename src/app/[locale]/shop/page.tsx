import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageFrame from "@/components/page-frame";
import ShopList from "@/components/ShopList";
import Loja from "@/components/shoppage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Shop" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/shop`,
      languages: {
        en: "/en/shop",
        pt: "/pt/shop",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `/${locale}/shop`,
    },
  };
}

const ShopPage = () => {
  return (
    <PageFrame>
      <ShopList />
      <Loja />
    </PageFrame>
  );
};

export default ShopPage;
