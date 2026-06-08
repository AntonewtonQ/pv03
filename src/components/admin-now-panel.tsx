"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ExternalLink, Loader2, Radio, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { db } from "@/lib/firebase";
import { emptyNowContent, toNowContent, type NowContent } from "@/lib/now";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";

export default function AdminNowPanel() {
  const t = useTranslations("Admin");
  const [form, setForm] = useState<NowContent>(emptyNowContent);
  const [status, setStatus] = useState<"loading" | "idle" | "saving">(
    "loading"
  );
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNow = async () => {
      try {
        const snapshot = await getDoc(doc(db, "now", "current"));
        setForm(snapshot.exists() ? toNowContent(snapshot.data()) : emptyNowContent);
      } catch {
        setError(t("loadError"));
      } finally {
        setStatus("idle");
      }
    };

    void loadNow();
  }, [t]);

  const updateField = (field: keyof NowContent, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setNotice("");
    setError("");

    const payload = {
      ...form,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "now", "current"), payload);
      setForm(payload);
      setNotice(t("nowSaveSuccess"));
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : t("saveError");

      setError(
        message.toLowerCase().includes("missing or insufficient permissions")
          ? t("firestorePermissionError")
          : message
      );
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-lg border border-white/10 bg-white/[0.03]"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
            <Radio size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">{t("nowEditor")}</p>
            <p className="mt-1 text-xs text-zinc-500">{t("nowEditorHint")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            type="button"
            variant="ghost"
            className="h-10 border border-white/10 bg-black px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <Link href="/now" target="_blank">
              <ExternalLink size={15} />
              {t("viewNow")}
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={status !== "idle"}
            className="h-10 justify-between rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-zinc-200"
          >
            {status === "saving" ? t("saving") : t("save")}
            {status !== "idle" ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Save size={15} />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm md:col-span-2">
          <span className="text-zinc-300">{t("nowHeadline")}</span>
          <input
            value={form.headline}
            onChange={(event) => updateField("headline", event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        <label className="block space-y-2 text-sm md:col-span-2">
          <span className="text-zinc-300">{t("nowSummary")}</span>
          <textarea
            value={form.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            className="min-h-24 w-full resize-y rounded-md border border-white/10 bg-black p-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-zinc-300">{t("nowAvailability")}</span>
          <input
            value={form.availability}
            onChange={(event) => updateField("availability", event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-zinc-300">{t("nowLocation")}</span>
          <input
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-zinc-300">{t("nowProjectName")}</span>
          <input
            value={form.projectName}
            onChange={(event) => updateField("projectName", event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-zinc-300">{t("nowProjectLink")}</span>
          <input
            type="url"
            value={form.projectLink}
            onChange={(event) => updateField("projectLink", event.target.value)}
            placeholder="https://"
            className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
          />
        </label>

        {(
          [
            ["focus", t("nowFocus")],
            ["building", t("nowBuilding")],
            ["learning", t("nowLearning")],
          ] as const
        ).map(([field, label]) => (
          <label key={field} className="block space-y-2 text-sm">
            <span className="text-zinc-300">{label}</span>
            <textarea
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              placeholder={t("onePerLine")}
              className="min-h-40 w-full resize-y rounded-md border border-white/10 bg-black p-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
            />
          </label>
        ))}
      </div>

      {notice || error ? (
        <div className="border-t border-white/10 p-4">
          {notice ? (
            <p className="rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
