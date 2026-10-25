import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: `Contact ${SITE.name}, report a price or list your store.`, alternates: { canonical: "/contact" } };

export default function Contact() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-black">Contact us</h1>
      <p className="mt-2 text-muted">Wrong price, missing card, or a store that should be listed? We read everything.</p>
      <ContactForm />
    </div>
  );
}
