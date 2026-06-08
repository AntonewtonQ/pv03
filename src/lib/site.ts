const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://antonewton.xyz";

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");

export const absoluteUrl = (pathname: string) => {
  return new URL(pathname, `${SITE_URL}/`).toString();
};
