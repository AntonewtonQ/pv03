"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "./productcard";
import { db } from "@/lib/firebase";
import { Button } from "./ui/button";

interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const Loja = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const t = useTranslations("Shop");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];
        setItems(fetchedItems);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    fetchItems();
  }, []);

  const sortedItems = useMemo(() => {
    return [...items]
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        return sortAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
  }, [items, searchTerm, sortAscending]);

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-3 border-y border-white/10 py-5 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
            />
          </label>

          <Button
            type="button"
            onClick={() => setSortAscending((value) => !value)}
            variant="ghost"
            className="h-11 justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-300 hover:bg-white/10 hover:text-white md:w-44"
          >
            {sortAscending ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
            {sortAscending ? t("sortAsc") : t("sortDesc")}
          </Button>
        </div>

        {status === "loading" ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
            {t("loading")}
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-8 text-center text-sm text-amber-100">
            {t("error")}
          </div>
        ) : null}

        {status === "ready" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => <ProductCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full rounded-md border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
                {t("noitems")}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Loja;
