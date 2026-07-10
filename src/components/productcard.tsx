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
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-sm border border-white/[0.09] bg-[#0d0c09] text-white transition hover:border-orange-400/35">
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
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
        />
        <span className="font-technical absolute left-3 top-3 inline-flex h-7 items-center gap-2 border border-orange-400/40 bg-[#090806]/90 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          {t("available")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h3 className="min-h-12 text-base font-semibold leading-6 text-white">
            {item.name}
          </h3>
          <p className="font-technical text-lg font-semibold text-orange-300">
            {formattedPrice}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => onAdd(item)}
          className={`mt-auto h-10 justify-between rounded-sm px-3 text-sm font-semibold shadow-none ${
            quantity > 0
              ? "border border-orange-400/35 bg-orange-400/10 text-orange-200 hover:bg-orange-400/15"
              : "bg-orange-500 text-black hover:bg-orange-400"
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
