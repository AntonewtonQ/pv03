import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
export async function pageMetadata(
  locale: string,
  page: "home" | "projects" | "about" | "contact",
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "SEO" });
  const path = page === "home" ? "" : `/${page}`;
  const title = t(`${page}Title`);
  const description = t(`${page}Description`);
  return {
    title: { absolute: `${title} | Antonewton Quima` },
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        pt: `/pt${path}`,
        "x-default": `/en${path}`,
      },
    },
    openGraph: {
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Antonewton Quima — Web & Odoo",
        },
      ],
      title: `${title} | Antonewton Quima`,
      description,
      type: "website",
      url: `/${locale}${path}`,
      locale: locale === "pt" ? "pt_AO" : "en_US",
      alternateLocale: locale === "pt" ? "en_US" : "pt_AO",
      siteName: "Antonewton Quima",
    },
    twitter: {
      images: [`/${locale}/twitter-image`],
      card: "summary_large_image",
      title: `${title} | Antonewton Quima`,
      description,
    },
  };
}
