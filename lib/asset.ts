/**
 * Prefix for files in /public when the site is served from a sub-folder
 * (GitHub Pages serves it at /wepic). Empty on Vercel/Netlify or a custom domain.
 * next/image and next/link add it automatically; use asset() for <video>, <img> and similar.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** True in the GitHub Pages build: there is no server, so no AI endpoint. */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
