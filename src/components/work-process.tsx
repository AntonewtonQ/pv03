import { useTranslations } from "next-intl";
export default function WorkProcess() {
  const t = useTranslations("Process");
  return (
    <section className="border-t border-white/10 py-16 md:py-20">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 className="section-title mt-4">{t("title")}</h2>
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {(t.raw("steps") as { title: string; text: string }[]).map(
          (step, i) => (
            <li key={step.title} className="border-t border-white/15 pt-5">
              <span
                className="font-technical text-sm text-orange-400"
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {step.text}
              </p>
            </li>
          ),
        )}
      </ol>
    </section>
  );
}
