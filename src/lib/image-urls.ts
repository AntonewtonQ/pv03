export const FALLBACK_PRODUCT_IMAGE_URL = "/images/tech-shirt-fallback.webp";

const LEGACY_IMAGE_ORIGIN =
  "https://rsv-ink-images-production.s3.sa-east-1.amazonaws.com";
const CURRENT_IMAGE_ORIGIN = "https://gcp-images.majestic.ink.rsvcloud.com";

export const normalizeRsvImageUrl = (imageUrl?: string | null) => {
  const trimmedImageUrl = imageUrl?.trim() ?? "";

  if (!trimmedImageUrl) {
    return "";
  }

  try {
    const url = new URL(trimmedImageUrl);

    if (url.origin === LEGACY_IMAGE_ORIGIN) {
      return `${CURRENT_IMAGE_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return trimmedImageUrl;
  }

  return trimmedImageUrl;
};

export const getProductImageUrl = (imageUrl?: string | null) => {
  return normalizeRsvImageUrl(imageUrl) || FALLBACK_PRODUCT_IMAGE_URL;
};
