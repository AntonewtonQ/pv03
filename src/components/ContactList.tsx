import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
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
      href: "https://www.linkedin.com/in/antonewton-quima-95aaa3238/",
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

        <div className="grid gap-3 border-y border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.href}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                className="min-h-32 rounded-md border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <Icon size={20} className="text-emerald-300" />
                <p className="mt-5 text-sm font-semibold text-white">
                  {channel.label}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
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
