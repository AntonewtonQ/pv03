import { getTranslations } from "next-intl/server";
import ContactList from "@/components/ContactList";
import ContactForm from "@/components/forms/ContactForm";
import PageFrame from "@/components/page-frame";
import WorkProcess from "@/components/work-process";
import { isContactConfigured } from "@/lib/contact-config";
import { pageMetadata } from "@/lib/page-metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata((await params).locale, "contact");
}
export default async function ContactPage() {
  const t = await getTranslations("Contact");
  return (
    <PageFrame>
      <ContactList />
      {isContactConfigured() ? (
        <ContactForm />
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <p className="max-w-2xl leading-8 text-zinc-300">
            {t("emailFallback")}
          </p>
          <a
            className="text-link mt-4 break-all"
            href="mailto:antonewtonquima@gmail.com"
          >
            antonewtonquima@gmail.com
          </a>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <WorkProcess />
      </div>
    </PageFrame>
  );
}
