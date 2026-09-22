"use client";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
const emptyForm = { name: "", email: "", message: "", budget: "", website: "" };
const fieldClass =
  "w-full rounded-sm border border-white/25 bg-[#0d0c09] px-4 py-3 text-base text-white placeholder:text-zinc-400 focus:border-orange-400";
export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const contact = useTranslations("Contact");
  const [status, setStatus] = useState<
    "idle" | "sending" | "accepted" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (status !== "sending") setStatus("idle");
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending" || status === "accepted" || status === "success")
      return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(20000),
      });
      const data = (await response.json()) as {
        error?: string;
        status?: string;
      };
      if (!response.ok)
        throw new Error(
          t(
            data.error === "submission-unknown"
              ? "unknown"
              : data.error === "rate-limited"
                ? "rateLimited"
                : data.error === "contact-not-configured"
                  ? "notConfigured"
                  : "error",
          ),
        );
      if (data.status !== "delivered" && data.status !== "accepted")
        throw new Error(t("error"));
      setStatus(data.status === "delivered" ? "success" : "accepted");
    } catch (error) {
      setErrorMessage(
        error instanceof Error &&
          !["TimeoutError", "TypeError", "AbortError"].includes(error.name)
          ? error.message
          : t("unknown"),
      );
      setStatus("error");
    }
  };
  return (
    <section className="px-6 pb-12 pt-8 md:px-10 md:pb-16">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl space-y-6"
          aria-busy={status === "sending"}
          aria-describedby="required-hint contact-privacy"
        >
          <p id="required-hint" className="text-sm text-zinc-400">
            {t("requiredHint")}
          </p>
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
          <fieldset
            disabled={status === "sending"}
            className="space-y-6 disabled:opacity-70"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm text-zinc-200" htmlFor="name">
                  {t("name")}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("namePlaceholder")}
                  minLength={2}
                  maxLength={100}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-zinc-200" htmlFor="email">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("emailPlaceholder")}
                  maxLength={160}
                  required
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-200" htmlFor="message">
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
                required
                className={`${fieldClass} min-h-44 resize-y`}
              />
            </div>
            <div className="max-w-md space-y-2">
              <label className="block text-sm text-zinc-200" htmlFor="budget">
                {t("budget")}
              </label>
              <input
                id="budget"
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder={t("budgetPlaceholder")}
                maxLength={100}
                aria-describedby="budget-hint"
                className={fieldClass}
              />
              <p id="budget-hint" className="text-xs leading-6 text-zinc-400">
                {t("budgetHint")}
              </p>
            </div>
          </fieldset>
          <p
            id="contact-privacy"
            className="max-w-2xl text-xs leading-6 text-zinc-400"
          >
            {contact("privacy")}
          </p>
          <button
            type="submit"
            disabled={
              status === "sending" ||
              status === "accepted" ||
              status === "success"
            }
            className="primary-cta disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} aria-hidden="true" />
            {status === "sending" ? t("sending") : t("submit")}
          </button>
          <div aria-live="polite" aria-atomic="true">
            {status === "accepted" || status === "success" ? (
              <p className="border border-orange-300/30 p-4 text-sm leading-7 text-orange-100">
                {t(status)}
              </p>
            ) : null}
          </div>
          {status === "error" && (
            <p
              role="alert"
              className="border border-amber-300/30 p-4 text-sm leading-7 text-amber-100"
            >
              {errorMessage}
            </p>
          )}
          <p className="text-sm text-zinc-400">
            {contact("channels.email")}:{" "}
            <a
              className="break-all text-zinc-200 underline underline-offset-4 hover:text-orange-300"
              href="mailto:antonewtonquima@gmail.com"
            >
              antonewtonquima@gmail.com
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
