"use client";

import { Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  FALLBACK_PRODUCT_IMAGE_URL,
  getProductImageUrl,
} from "@/lib/image-urls";
import type { ShopItem } from "@/lib/shop-types";

interface ProductCardProps {
  item: ShopItem;
  formattedPrice: string;
  quantity: number;
  onAdd: (item: ShopItem) => void;
}

const ProductCard = ({
  item,
  formattedPrice,
  quantity,
  onAdd,
}: ProductCardProps) => {
  const t = useTranslations("Shop");
  const [imageSrc, setImageSrc] = useState(getProductImageUrl(item.imageUrl));

  useEffect(() => {
    setImageSrc(getProductImageUrl(item.imageUrl));
  }, [item.imageUrl]);

  return (
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-white transition hover:border-white/25 hover:bg-white/[0.06]">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          onError={() => {
            if (imageSrc !== FALLBACK_PRODUCT_IMAGE_URL) {
              setImageSrc(FALLBACK_PRODUCT_IMAGE_URL);
            }
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex h-7 items-center gap-2 rounded-md border border-black/10 bg-white px-2.5 text-[11px] font-bold uppercase text-black shadow">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("available")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h3 className="min-h-12 text-base font-bold leading-6 text-white">
            {item.name}
          </h3>
          <p className="text-xl font-bold text-emerald-200">
            {formattedPrice}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => onAdd(item)}
          className={`mt-auto h-10 justify-between rounded-md px-3 text-sm font-bold ${
            quantity > 0
              ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20"
              : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          {quantity > 0
            ? t("inCart", { quantity })
            : t("addToCart")}
          {quantity > 0 ? <Check /> : <Plus />}
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
