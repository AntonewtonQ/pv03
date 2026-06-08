"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (data.error === "rate-limited") {
          throw new Error(t("rateLimited"));
        }

        if (data.error === "contact-not-configured") {
          throw new Error(t("notConfigured"));
        }

        throw new Error(t("error"));
      }

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
      setStatus("success");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error ? submitError.message : t("error")
      );
      setStatus("error");
    }
  };

  return (
    <section className="px-6 pb-12 pt-2 md:px-10 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 border-y border-white/10 py-8"
        >
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

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
                minLength={2}
                maxLength={100}
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
                maxLength={160}
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
              minLength={3}
              maxLength={160}
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
              minLength={10}
              maxLength={5000}
              className="min-h-40 w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-11 items-center justify-between gap-3 rounded-md bg-white px-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-60"
          >
            <Send size={18} />
            {status === "sending" ? t("sending") : t("submit")}
          </button>

          {status === "success" ? (
            <p
              role="status"
              className="rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100"
            >
              {t("success")}
            </p>
          ) : null}

          {status === "error" ? (
            <p
              role="alert"
              className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100"
            >
              {errorMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
