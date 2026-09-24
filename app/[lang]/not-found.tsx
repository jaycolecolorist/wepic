import Link from "next/link";
import { Monogram } from "@/components/Logo";

// Rendered for unknown pages inside a language. Bilingual because not-found pages don't receive params.
export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[80vh] items-center justify-center bg-midnight px-6 pt-24 text-center text-white">
      <div>
        <Monogram className="mx-auto h-14 w-auto text-cyan" />
        <h1 className="display mt-8 text-5xl">404</h1>
        <p className="mt-4 text-lg text-mist">Page not found · الصفحة غير موجودة</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/en" className="btn btn-primary">Home</Link>
          <Link href="/ar" className="btn btn-ghost font-arabic">الرئيسية</Link>
        </div>
      </div>
    </section>
  );
}
