"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  FALLBACK_PRODUCT_IMAGE_URL,
  getProductImageUrl,
} from "@/lib/image-urls";

interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  item: Item;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const t = useTranslations("Shop");
  const [imageSrc, setImageSrc] = useState(getProductImageUrl(item.imageUrl));
  const formattedPrice = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(item.price);

  useEffect(() => {
    setImageSrc(getProductImageUrl(item.imageUrl));
  }, [item.imageUrl]);

  const handleBuyClick = () => {
    const message = t("whatsappMessage", {
      name: item.name,
      price: formattedPrice,
    });
    const phoneNumber = "+244943670112";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-white transition hover:border-white/25 hover:bg-white/[0.06]">
      <div className="aspect-[4/5] overflow-hidden bg-zinc-950">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => {
            if (imageSrc !== FALLBACK_PRODUCT_IMAGE_URL) {
              setImageSrc(FALLBACK_PRODUCT_IMAGE_URL);
            }
          }}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold leading-snug text-white">
            {item.name}
          </h3>
          <p className="text-xl font-bold text-emerald-200">
            {formattedPrice}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleBuyClick}
          className="mt-auto h-10 justify-between rounded-md bg-white px-3 text-sm font-bold text-black hover:bg-zinc-200"
        >
          {t("buy")}
          <ShoppingBag />
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
