"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <section className="px-6 pb-12 pt-2 md:px-10 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <form
          action="https://formsubmit.co/antonewtonquima@gmail.com"
          method="POST"
          className="space-y-5 border-y border-white/10 py-8"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Portfolio contact" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm text-zinc-300" htmlFor="name">
                {t("name")}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("namePlaceholder")}
                className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-300" htmlFor="email">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
                className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-zinc-300" htmlFor="subject">
              {t("subject")}
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={t("subjectPlaceholder")}
              className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-zinc-300" htmlFor="message">
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t("messagePlaceholder")}
              className="min-h-40 w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-between gap-3 rounded-md bg-white px-4 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            <Send size={18} />
            {t("submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
