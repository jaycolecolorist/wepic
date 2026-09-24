// Used only in the static (GitHub Pages) build, where Next can't resize images on a server:
// serve the pre-sized JPEG from /public, with the sub-folder prefix.
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}` : src;
}
