"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  FolderKanban,
  ImageIcon,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { auth, db } from "@/lib/firebase";
import {
  FALLBACK_PRODUCT_IMAGE_URL,
  getProductImageUrl,
  normalizeRsvImageUrl,
} from "@/lib/image-urls";
import { Button } from "./ui/button";

type CollectionKey = "items" | "projects";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}

interface ItemForm {
  name: string;
  price: string;
  imageUrl: string;
}

interface ProjectForm {
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}

const emptyItemForm: ItemForm = {
  name: "",
  price: "",
  imageUrl: "",
};

const emptyProjectForm: ProjectForm = {
  name: "",
  description: "",
  year: new Date().getFullYear().toString(),
  cover: "",
  link: "",
};

const toText = (value: unknown) => (value == null ? "" : String(value));

const toNumber = (value: unknown) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeCollection, setActiveCollection] =
    useState<CollectionKey>("items");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm);
  const [projectForm, setProjectForm] =
    useState<ProjectForm>(emptyProjectForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const activeDocuments = activeCollection === "items" ? items : projects;
  const collectionLabel =
    activeCollection === "items" ? t("shop") : t("projects");
  const itemPreview = getProductImageUrl(itemForm.imageUrl);
  const projectPreview =
    normalizeRsvImageUrl(projectForm.cover) || "/images/cover.png";

  const totals = useMemo(
    () => [
      { label: t("shop"), value: items.length, icon: ShoppingBag },
      { label: t("projects"), value: projects.length, icon: FolderKanban },
    ],
    [items.length, projects.length, t]
  );

  const resetForm = useCallback((collectionKey: CollectionKey) => {
    setSelectedId(null);
    setNotice("");
    setError("");

    if (collectionKey === "items") {
      setItemForm(emptyItemForm);
      return;
    }

    setProjectForm(emptyProjectForm);
  }, []);

  const loadCollection = useCallback(
    async (collectionKey: CollectionKey) => {
      setStatus("loading");
      setError("");

      try {
        const snapshot = await getDocs(collection(db, collectionKey));

        if (collectionKey === "items") {
          const nextItems = snapshot.docs
            .map((itemDoc) => {
              const data = itemDoc.data();

              return {
                id: itemDoc.id,
                name: toText(data.name),
                price: toNumber(data.price),
                imageUrl: toText(data.imageUrl),
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

          setItems(nextItems);
        } else {
          const nextProjects = snapshot.docs
            .map((projectDoc) => {
              const data = projectDoc.data();

              return {
                id: projectDoc.id,
                name: toText(data.name),
                description: toText(data.description),
                year: toText(data.year),
                cover: toText(data.cover),
                link: toText(data.link),
              };
            })
            .sort((a, b) => b.year.localeCompare(a.year));

          setProjects(nextProjects);
        }
      } catch {
        setError(t("loadError"));
      } finally {
        setStatus("idle");
      }
    },
    [t]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    void loadCollection(activeCollection);
  }, [activeCollection, loadCollection, user]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setError("");
    setNotice("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
      setNotice(t("loginSuccess"));
    } catch {
      setError(t("loginError"));
    } finally {
      setStatus("idle");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setItems([]);
    setProjects([]);
    resetForm(activeCollection);
  };

  const handleSelectCollection = (collectionKey: CollectionKey) => {
    setActiveCollection(collectionKey);
    resetForm(collectionKey);
  };

  const handleSelectDocument = (id: string) => {
    setSelectedId(id);
    setNotice("");
    setError("");

    if (activeCollection === "items") {
      const selectedItem = items.find((item) => item.id === id);

      if (!selectedItem) {
        return;
      }

      setItemForm({
        name: selectedItem.name,
        price: String(selectedItem.price),
        imageUrl: selectedItem.imageUrl,
      });
      return;
    }

    const selectedProject = projects.find((project) => project.id === id);

    if (!selectedProject) {
      return;
    }

    setProjectForm({
      name: selectedProject.name,
      description: selectedProject.description,
      year: selectedProject.year,
      cover: selectedProject.cover,
      link: selectedProject.link,
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setNotice("");
    setError("");

    try {
      if (activeCollection === "items") {
        if (!itemForm.name.trim()) {
          setError(t("nameRequired"));
          return;
        }

        const payload = {
          name: itemForm.name.trim(),
          price: toNumber(itemForm.price),
          imageUrl: normalizeRsvImageUrl(itemForm.imageUrl),
        };

        if (selectedId) {
          await updateDoc(doc(db, "items", selectedId), payload);
        } else {
          const createdDoc = await addDoc(collection(db, "items"), payload);
          setSelectedId(createdDoc.id);
        }

        setItemForm({
          name: payload.name,
          price: String(payload.price),
          imageUrl: payload.imageUrl,
        });
        await loadCollection("items");
      } else {
        if (!projectForm.name.trim()) {
          setError(t("nameRequired"));
          return;
        }

        const payload = {
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
          year: projectForm.year.trim(),
          cover: normalizeRsvImageUrl(projectForm.cover),
          link: projectForm.link.trim(),
        };

        if (selectedId) {
          await updateDoc(doc(db, "projects", selectedId), payload);
        } else {
          const createdDoc = await addDoc(collection(db, "projects"), payload);
          setSelectedId(createdDoc.id);
        }

        setProjectForm(payload);
        await loadCollection("projects");
      }

      setNotice(t("saveSuccess"));
    } catch {
      setError(t("saveError"));
    } finally {
      setStatus("idle");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    const selectedName =
      activeCollection === "items" ? itemForm.name : projectForm.name;

    if (!window.confirm(t("deleteConfirm", { name: selectedName }))) {
      return;
    }

    setStatus("saving");
    setNotice("");
    setError("");

    try {
      await deleteDoc(doc(db, activeCollection, selectedId));
      resetForm(activeCollection);
      await loadCollection(activeCollection);
      setNotice(t("deleteSuccess"));
    } catch {
      setError(t("deleteError"));
    } finally {
      setStatus("idle");
    }
  };

  if (!authReady) {
    return (
      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
          <Loader2 className="animate-spin text-emerald-300" size={18} />
          {t("checking")}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="space-y-4 border-y border-white/10 py-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-200">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-400">
              {t("subtitle")}
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 rounded-lg border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                <Lock size={18} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {t("loginTitle")}
                </h2>
                <p className="text-sm text-zinc-500">{t("loginSubtitle")}</p>
              </div>
            </div>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-300">{t("email")}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                placeholder="admin@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-300">{t("password")}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                placeholder="********"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? (
              <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={status === "saving"}
              className="h-11 w-full justify-between rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-zinc-200"
            >
              {status === "saving" ? t("entering") : t("enter")}
              {status === "saving" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <LogIn size={16} />
              )}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-4 border-y border-white/10 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {t("dashboardTitle")}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">{user.email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => void loadCollection(activeCollection)}
              disabled={status !== "idle"}
              className="h-10 border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <RefreshCcw size={15} />
              {t("refresh")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void handleLogout()}
              className="h-10 border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={15} />
              {t("logout")}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {totals.map((total) => {
            const Icon = total.icon;

            return (
              <div
                key={total.label}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="text-sm text-zinc-500">{total.label}</p>
                  <p className="text-3xl font-black text-white">{total.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                  <Icon size={18} />
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["items", "projects"] as const).map((collectionKey) => {
            const isActive = activeCollection === collectionKey;
            const Icon = collectionKey === "items" ? ShoppingBag : FolderKanban;

            return (
              <Button
                key={collectionKey}
                type="button"
                variant="ghost"
                onClick={() => handleSelectCollection(collectionKey)}
                className={`h-10 border px-3 text-xs ${
                  isActive
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {collectionKey === "items" ? t("shop") : t("projects")}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-[330px_1fr]">
          <aside className="rounded-lg border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <p className="text-sm font-bold text-white">{collectionLabel}</p>
                <p className="text-xs text-zinc-500">
                  {t("documentsCount", { count: activeDocuments.length })}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => resetForm(activeCollection)}
                className="h-9 border border-white/10 bg-black px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                <Plus size={15} />
                {t("new")}
              </Button>
            </div>

            <div className="max-h-[640px] overflow-y-auto p-2">
              {status === "loading" ? (
                <div className="flex items-center gap-2 p-4 text-sm text-zinc-500">
                  <Loader2 className="animate-spin text-emerald-300" size={16} />
                  {t("loading")}
                </div>
              ) : null}

              {activeDocuments.length === 0 && status !== "loading" ? (
                <div className="p-4 text-sm text-zinc-500">{t("empty")}</div>
              ) : null}

              {activeDocuments.map((documentItem) => {
                const isSelected = selectedId === documentItem.id;
                const imageUrl =
                  activeCollection === "items"
                    ? getProductImageUrl((documentItem as ShopItem).imageUrl)
                    : normalizeRsvImageUrl((documentItem as ProjectItem).cover) ||
                      "/images/cover.png";

                return (
                  <button
                    key={documentItem.id}
                    type="button"
                    onClick={() => handleSelectDocument(documentItem.id)}
                    className={`flex w-full gap-3 rounded-md border p-2 text-left transition ${
                      isSelected
                        ? "border-emerald-300/40 bg-emerald-300/10"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-950">
                      <img
                        src={imageUrl}
                        alt={documentItem.name}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-white">
                        {documentItem.name || t("untitled")}
                      </span>
                      <span className="mt-1 block truncate font-mono text-xs text-zinc-500">
                        {documentItem.id}
                      </span>
                      <span className="mt-1 block truncate text-xs text-zinc-500">
                        {activeCollection === "items"
                          ? new Intl.NumberFormat("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                              maximumFractionDigits: 0,
                            }).format((documentItem as ShopItem).price)
                          : (documentItem as ProjectItem).year}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <form
            onSubmit={handleSave}
            className="rounded-lg border border-white/10 bg-white/[0.03]"
          >
            <div className="flex flex-col gap-4 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedId ? t("editDocument") : t("newDocument")}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {selectedId || t("notSaved")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedId ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleDelete()}
                    disabled={status !== "idle"}
                    className="h-10 border border-red-300/30 bg-red-300/10 px-3 text-xs text-red-100 hover:bg-red-300/20"
                  >
                    <Trash2 size={15} />
                    {t("delete")}
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  disabled={status !== "idle"}
                  className="h-10 justify-between rounded-md bg-white px-4 text-sm font-bold text-black hover:bg-zinc-200"
                >
                  {status === "saving" ? t("saving") : t("save")}
                  {status === "saving" ? (
                    <Loader2 className="animate-spin" size={15} />
                  ) : (
                    <Save size={15} />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-5 p-4 xl:grid-cols-[280px_1fr]">
              <div className="space-y-3">
                <div
                  className={`overflow-hidden rounded-lg border border-white/10 bg-zinc-950 ${
                    activeCollection === "items" ? "aspect-[4/5]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={
                      activeCollection === "items" ? itemPreview : projectPreview
                    }
                    alt={
                      activeCollection === "items"
                        ? itemForm.name
                        : projectForm.name
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        activeCollection === "items"
                          ? FALLBACK_PRODUCT_IMAGE_URL
                          : "/images/cover.png";
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black p-3 text-xs text-zinc-500">
                  <ImageIcon size={15} className="shrink-0 text-emerald-300" />
                  <span className="truncate">
                    {activeCollection === "items"
                      ? normalizeRsvImageUrl(itemForm.imageUrl) || t("noImage")
                      : normalizeRsvImageUrl(projectForm.cover) || t("noImage")}
                  </span>
                </div>
              </div>

              {activeCollection === "items" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2 text-sm md:col-span-2">
                    <span className="text-zinc-300">{t("name")}</span>
                    <input
                      value={itemForm.name}
                      onChange={(event) =>
                        setItemForm((currentForm) => ({
                          ...currentForm,
                          name: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                      required
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="text-zinc-300">{t("price")}</span>
                    <input
                      type="number"
                      min="0"
                      value={itemForm.price}
                      onChange={(event) =>
                        setItemForm((currentForm) => ({
                          ...currentForm,
                          price: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                      required
                    />
                  </label>

                  <label className="block space-y-2 text-sm md:col-span-2">
                    <span className="text-zinc-300">{t("imageUrl")}</span>
                    <input
                      value={itemForm.imageUrl}
                      onChange={(event) =>
                        setItemForm((currentForm) => ({
                          ...currentForm,
                          imageUrl: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2 text-sm md:col-span-2">
                    <span className="text-zinc-300">{t("name")}</span>
                    <input
                      value={projectForm.name}
                      onChange={(event) =>
                        setProjectForm((currentForm) => ({
                          ...currentForm,
                          name: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                      required
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="text-zinc-300">{t("year")}</span>
                    <input
                      value={projectForm.year}
                      onChange={(event) =>
                        setProjectForm((currentForm) => ({
                          ...currentForm,
                          year: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                      required
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="text-zinc-300">{t("link")}</span>
                    <input
                      value={projectForm.link}
                      onChange={(event) =>
                        setProjectForm((currentForm) => ({
                          ...currentForm,
                          link: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                    />
                  </label>

                  <label className="block space-y-2 text-sm md:col-span-2">
                    <span className="text-zinc-300">{t("cover")}</span>
                    <input
                      value={projectForm.cover}
                      onChange={(event) =>
                        setProjectForm((currentForm) => ({
                          ...currentForm,
                          cover: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                    />
                  </label>

                  <label className="block space-y-2 text-sm md:col-span-2">
                    <span className="text-zinc-300">{t("description")}</span>
                    <textarea
                      value={projectForm.description}
                      onChange={(event) =>
                        setProjectForm((currentForm) => ({
                          ...currentForm,
                          description: event.target.value,
                        }))
                      }
                      className="min-h-32 w-full resize-y rounded-md border border-white/10 bg-black p-3 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
                    />
                  </label>
                </div>
              )}
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
        </div>
      </div>
    </section>
  );
}
