"use client";
import { useSearchParams } from "next/navigation";
import { bookingKinds, type BookingKind } from "@/lib/booking";
import { BookingForm } from "./BookingForm";

/** Reads ?type=…&item=… (from the pricing and service buttons) in the browser, so the page can stay static. */
export function BookingFromQuery() {
  const sp = useSearchParams();
  const t = sp.get("type");
  const type: BookingKind = t && (bookingKinds as string[]).includes(t) ? (t as BookingKind) : "package";
  const item = sp.get("item") ?? undefined;
  // key forces a fresh form when the query string changes (e.g. clicking another package)
  return <BookingForm key={`${type}-${item}`} initialType={type} initialItem={item} />;
}
