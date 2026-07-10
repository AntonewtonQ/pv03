import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "./section-heading";

const ContactList = () => {
  const t = useTranslations("Contact");

  const channels = [
    {
      href: "mailto:antonewtonquima@gmail.com",
      label: t("channels.email"),
      value: "antonewtonquima@gmail.com",
      icon: Mail,
    },
    {
      href: "https://wa.me/244943670112",
      label: t("channels.whatsapp"),
      value: "+244 943 670 112",
      icon: MessageCircle,
    },
    {
      href: "https://github.com/AntonewtonQ",
      label: "GitHub",
      value: "@AntonewtonQ",
      icon: Github,
    },
    {
      href: "https://www.linkedin.com/in/antonewton/",
      label: "LinkedIn",
      value: "Antonewton Quima",
      icon: Linkedin,
    },
  ];

  return (
    <section className="px-6 pt-10 md:px-10 md:pt-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid border-y border-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.href}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                className="group relative min-h-36 border-b border-white/[0.08] py-6 pr-5 transition hover:bg-white/[0.018] sm:px-5 sm:first:border-r lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <div className="flex items-center justify-between">
                  <Icon size={19} className="text-orange-400" />
                  <ArrowUpRight
                    size={15}
                    className="text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
                  />
                </div>
                <p className="mt-6 text-sm font-semibold text-white">
                  {channel.label}
                </p>
                <p className="font-technical mt-2 break-all text-[11px] leading-5 text-zinc-500">
                  {channel.value}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactList;
