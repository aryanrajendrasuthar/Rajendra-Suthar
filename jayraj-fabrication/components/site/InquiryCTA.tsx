import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function InquiryCTA() {
  return (
    <section className="bg-jf-lime py-20">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <h2
          className="font-display font-bold uppercase leading-tight text-black"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          READY TO BUILD SOMETHING GREAT?
        </h2>
        <p className="mt-4 text-lg text-black/60">
          Tell us about your project. Our team responds within 24 hours.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-7 py-3.5 font-semibold text-white transition-all hover:bg-jf-charcoal hover:scale-105 active:scale-95"
          >
            INQUIRE NOW
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
