import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Antonewton Quima | Odoo Developer",
    template: "%s | Antonewton Quima",
  },
  description:
    "Portfolio v4.0 de Antonewton Quima, desenvolvedor de software em Luanda.",
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
    description:
      "Portfolio de Antonewton Quima: software, ERP, automação e produtos digitais.",
    siteName: "Antonewton Quima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antonewton Quima | Odoo Developer",
    description:
      "Software, ERP, automação e produtos digitais por Antonewton Quima.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

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
      </body>
    </html>
  );
}
