import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const isPrivateIp = (address: string) => {
  const normalizedAddress = address.toLowerCase();
  const mappedIpv4 = normalizedAddress.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);

  if (mappedIpv4) {
    return isPrivateIp(mappedIpv4[1]);
  }

  if (
    address === "0.0.0.0" ||
    address.startsWith("127.") ||
    address.startsWith("10.") ||
    address.startsWith("192.168.") ||
    address.startsWith("169.254.")
  ) {
    return true;
  }

  const firstTwoOctets = address.split(".").map(Number);

  if (
    firstTwoOctets[0] === 172 &&
    firstTwoOctets[1] >= 16 &&
    firstTwoOctets[1] <= 31
  ) {
    return true;
  }

  return (
    normalizedAddress === "::1" ||
    normalizedAddress.startsWith("fc") ||
    normalizedAddress.startsWith("fd") ||
    normalizedAddress.startsWith("fe80:")
  );
};

export const assertPublicUrl = async (rawUrl: string) => {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("invalid-url");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("invalid-protocol");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("private-host");
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("private-ip");
  }

  const addresses = await lookup(hostname, { all: true });

  if (addresses.some((address) => isPrivateIp(address.address))) {
    throw new Error("private-ip");
  }

  return url;
};
