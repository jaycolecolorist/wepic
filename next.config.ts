import type { NextConfig } from "next";

/**
 * Two ways to build:
 *  - normal (`npm run build`): full site incl. the AI chat server route — for Vercel/Netlify/Node.
 *  - GitHub Pages (`STATIC_EXPORT=true`, see .github/workflows/pages.yml): plain files in /out,
 *    served from the /wepic sub-folder, chat in offline mode.
 */
const isStatic = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // The project lives on an external drive next to other folders; pin the root so
  // Next.js doesn't go looking for lockfiles higher up.
  turbopack: { root: __dirname },
  ...(isStatic ? { output: "export" as const, trailingSlash: true, basePath } : {}),
  images: isStatic
    ? // no server to resize images on GitHub Pages — serve the pre-sized files
      { loader: "custom", loaderFile: "./lib/image-loader.ts" }
    : {
        formats: ["image/avif", "image/webp"],
        qualities: [70, 80],
        deviceSizes: [480, 640, 828, 1080, 1440, 1920, 2400],
      },
  ...(isStatic
    ? {}
    : {
        async headers() {
          return [
            {
              // Photos and videos are replaced by changing the file name, so they can be cached for a long time.
              source: "/(images|media)/:path*",
              headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
            },
          ];
        },
      }),
};

export default nextConfig;
