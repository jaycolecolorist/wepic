import Image from "next/image";
import { CameraIcon } from "./Icons";
import { PlaceholderBadge } from "./Placeholder";

/** Service image, or a branded placeholder panel when WEPIC hasn't supplied one yet. */
export function ServiceVisual({ src, alt, sizes, placeholderLabel }: { src: string | null; alt: string; sizes: string; placeholderLabel: string }) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition duration-700 group-hover:scale-105" />;
  return (
    // TODO: replace with a real event photo (see config/site.ts → services)
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy to-midnight text-cyan/70">
      <CameraIcon className="h-12 w-12" />
      <PlaceholderBadge label={placeholderLabel} />
    </div>
  );
}
