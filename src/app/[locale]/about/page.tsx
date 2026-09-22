import AboutDesc from "@/components/aboutdesc";
import PageFrame from "@/components/page-frame";

import { pageMetadata } from "@/lib/page-metadata";
import ContactCTA from "@/components/contact-cta";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata((await params).locale, "about");
}
const AboutPage = () => {
  return (
    <PageFrame>
      <AboutDesc />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ContactCTA />
      </div>
    </PageFrame>
  );
};

export default AboutPage;
