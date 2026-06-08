"use client";

import { collection, getDocs } from "firebase/firestore";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  Search,
  SearchX,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  FALLBACK_PRODUCT_IMAGE_URL,
  getProductImageUrl,
} from "@/lib/image-urls";
import type { CartItem, ShopItem } from "@/lib/shop-types";
import ProductCard from "./productcard";
import { Button } from "./ui/button";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const CART_STORAGE_KEY = "portfolio-shop-cart";
const WHATSAPP_NUMBER = "244943670112";

const Loja = () => {
  const locale = useLocale();
  const t = useTranslations("Shop");
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "pt" ? "pt-AO" : "en-US", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0,
    }).format(price);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const fetchedItems = querySnapshot.docs.map((itemDoc) => {
          const data = itemDoc.data();

          return {
            id: itemDoc.id,
            name: String(data.name ?? ""),
            price: Number(data.price ?? 0),
            imageUrl: String(data.imageUrl ?? ""),
          };
        });

        setItems(fetchedItems);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    void fetchItems();
  }, []);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as unknown;

        if (Array.isArray(parsedCart)) {
          setCart(
            parsedCart.filter(
              (item): item is CartItem =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                typeof item.id === "string" &&
                "name" in item &&
                typeof item.name === "string" &&
                "price" in item &&
                typeof item.price === "number" &&
                "quantity" in item &&
                typeof item.quantity === "number" &&
                item.quantity > 0
            )
          );
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (cartReady) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, cartReady]);

  useEffect(() => {
    if (!cartReady || status !== "ready") {
      return;
    }

    setCart((currentCart) =>
      currentCart.flatMap((cartItem) => {
        const currentItem = items.find((item) => item.id === cartItem.id);

        return currentItem
          ? [{ ...currentItem, quantity: cartItem.quantity }]
          : [];
      })
    );
  }, [cartReady, items, status]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cartOpen]);

  const sortedItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase(locale);

    return [...items]
      .filter((item) =>
        item.name.toLocaleLowerCase(locale).includes(normalizedSearch)
      )
      .sort((a, b) => {
        if (sortOption === "price-asc") {
          return a.price - b.price;
        }

        if (sortOption === "price-desc") {
          return b.price - a.price;
        }

        return sortOption === "name-asc"
          ? a.name.localeCompare(b.name, locale)
          : b.name.localeCompare(a.name, locale);
      });
  }, [items, locale, searchTerm, sortOption]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const addToCart = (item: ShopItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const changeQuantity = (id: string, amount: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    const orderLines = cart.map(
      (item) =>
        `- ${item.quantity}x ${item.name} (${formatPrice(
          item.price * item.quantity
        )})`
    );
    const message = [
      t("orderIntro"),
      "",
      ...orderLines,
      "",
      `${t("orderTotal")}: ${formatPrice(cartTotal)}`,
      t("orderClosing"),
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid border-y border-white/10 sm:grid-cols-3">
            {[
              { icon: MessageCircle, title: t("directOrder"), text: t("directOrderText") },
              { icon: CheckCircle2, title: t("confirmation"), text: t("confirmationText") },
              { icon: MapPin, title: t("delivery"), text: t("deliveryText") },
            ].map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex gap-3 border-b border-white/10 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-emerald-300">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{benefit.title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 border-y border-white/10 py-5 md:grid-cols-[1fr_210px_auto]">
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
                className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/40 focus:bg-white/[0.05]"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
                  title={t("clearSearch")}
                  aria-label={t("clearSearch")}
                >
                  <X size={14} />
                </button>
              ) : null}
            </label>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              aria-label={t("sortLabel")}
              className="h-11 rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none transition focus:border-emerald-300/40"
            >
              <option value="name-asc">{t("sortNameAsc")}</option>
              <option value="name-desc">{t("sortNameDesc")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
            </select>

            <Button
              type="button"
              onClick={() => setCartOpen(true)}
              variant="ghost"
              className="h-11 justify-between rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 text-sm text-emerald-100 hover:bg-emerald-300/20 hover:text-white md:min-w-44"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag />
                {t("cart")}
              </span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-emerald-200 px-1.5 text-xs font-black text-black">
                {cartCount}
              </span>
            </Button>
          </div>

          {status === "loading" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="min-h-[390px] animate-pulse overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
                >
                  <div className="aspect-[4/5] bg-white/[0.05]" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-4/5 rounded bg-white/[0.07]" />
                    <div className="h-6 w-1/2 rounded bg-white/[0.07]" />
                    <div className="h-10 rounded bg-white/[0.07]" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-8 text-center text-sm text-amber-100">
              {t("error")}
            </div>
          ) : null}

          {status === "ready" ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                <p>{t("results", { count: sortedItems.length })}</p>
                {searchTerm ? (
                  <p>{t("searchingFor", { term: searchTerm })}</p>
                ) : null}
              </div>

              {sortedItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {sortedItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      formattedPrice={formatPrice(item.price)}
                      quantity={
                        cart.find((cartItem) => cartItem.id === item.id)
                          ?.quantity ?? 0
                      }
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-8 text-center">
                  <SearchX className="text-zinc-600" />
                  <p className="text-sm font-bold text-white">{t("noitems")}</p>
                  <p className="max-w-sm text-xs leading-5 text-zinc-500">
                    {t("noitemsHint")}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSearchTerm("")}
                    className="mt-2 h-9 border border-white/10 bg-black px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    {t("clearSearch")}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {cartOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-label={t("closeCart")}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t("cart")}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-black shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-lg font-bold text-white">{t("cart")}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {t("cartItems", { count: cartCount })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setCart([])}
                    className="h-9 w-9 border border-white/10 bg-white/[0.03] text-zinc-500 hover:bg-red-300/10 hover:text-red-200"
                    title={t("clearCart")}
                    aria-label={t("clearCart")}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCartOpen(false)}
                  className="h-9 w-9 border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
                  title={t("closeCart")}
                  aria-label={t("closeCart")}
                >
                  <X />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[64px_1fr_auto] gap-3 border-b border-white/10 pb-3"
                    >
                      <img
                        src={getProductImageUrl(item.imageUrl)}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_PRODUCT_IMAGE_URL;
                        }}
                        className="aspect-[4/5] h-20 rounded-md border border-white/10 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-emerald-200">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <div className="mt-3 flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="h-7 w-7 border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
                            aria-label={t("decreaseQuantity")}
                          >
                            <Minus size={13} />
                          </Button>
                          <span className="flex h-7 min-w-9 items-center justify-center text-xs text-white">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="h-7 w-7 border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white"
                            aria-label={t("increaseQuantity")}
                          >
                            <Plus size={13} />
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 text-zinc-600 hover:bg-red-300/10 hover:text-red-200"
                        title={t("removeItem")}
                        aria-label={t("removeItem")}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-500">
                    <ShoppingBag />
                  </span>
                  <p className="text-sm font-bold text-white">{t("emptyCart")}</p>
                  <p className="max-w-xs text-xs leading-5 text-zinc-500">
                    {t("emptyCartHint")}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCartOpen(false)}
                    className="mt-2 h-9 border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    {t("continueShopping")}
                  </Button>
                </div>
              )}
            </div>

            {cart.length > 0 ? (
              <div className="space-y-4 border-t border-white/10 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase text-zinc-500">
                      {t("orderTotal")}
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {formatPrice(cartTotal)}
                    </p>
                  </div>
                  <PackageCheck className="text-emerald-300" />
                </div>
                <Button
                  type="button"
                  onClick={handleCheckout}
                  className="h-12 w-full justify-between rounded-md bg-emerald-300 px-4 text-sm font-black text-black hover:bg-emerald-200"
                >
                  {t("checkout")}
                  <ChevronRight />
                </Button>
                <p className="text-center text-[11px] leading-5 text-zinc-600">
                  {t("checkoutHint")}
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {cartCount > 0 && !cartOpen ? (
        <Button
          data-presentation-hide
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 right-4 z-40 h-12 justify-between gap-5 rounded-md border border-emerald-200/30 bg-emerald-300 px-4 text-sm font-black text-black shadow-2xl hover:bg-emerald-200"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag />
            {t("cartItems", { count: cartCount })}
          </span>
          <span>{formatPrice(cartTotal)}</span>
        </Button>
      ) : null}
    </>
  );
};

export default Loja;
