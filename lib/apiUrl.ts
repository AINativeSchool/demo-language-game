import getConfig from "next/config";

// Prefixes API paths with the app's basePath. publicRuntimeConfig is set in
// next.config.ts; NEXT_PUBLIC_BASE_PATH is the App Router client fallback (inlined at build).
export function apiUrl(path: string): string {
  const { publicRuntimeConfig } = getConfig?.() ?? {};
  const base =
    publicRuntimeConfig?.basePath ?? process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
