import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PresentationModeProvider } from "@/components/presentation-mode";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description =
    locale === "pt"
      ? "Portfólio de Antonewton Quima: Odoo, desenvolvimento web, automação e produtos digitais."
      : "Antonewton Quima's portfolio: Odoo, web development, automation, and digital products.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Antonewton Quima | Odoo Developer",
      template: "%s | Antonewton Quima",
    },
    description,
    authors: [{ name: "Antonewton Quima", url: SITE_URL }],
    creator: "Antonewton Quima",
    keywords: [
      "Antonewton Quima",
      "Odoo Developer",
      "Software Developer",
      "Next.js",
      "Python",
      "Luanda",
      "Angola",
    ],
    openGraph: {
      type: "website",
      title: "Antonewton Quima | Odoo Developer",
      description,
      siteName: "Antonewton Quima",
    },
    twitter: {
      card: "summary_large_image",
      title: "Antonewton Quima | Odoo Developer",
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >
        <NextIntlClientProvider>
          <PresentationModeProvider>{children}</PresentationModeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
