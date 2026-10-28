import { Icon, I } from "../components/Icon";
import { WHATSAPP } from "../components/site";
import { BookCallForm } from "./BookCallForm";

export const metadata = {
  title: "Book a free setup call",
  description: "Book a free 15-minute call with the Oyklane team to set up your store, payments and shipping.",
  alternates: { canonical: "/book-a-call" },
};

export default function BookCallPage() {
  return (
    <>
      <section className="wrap page-hero page-hero--center" style={{ paddingBottom: 24 }}>
        <div>
          <span className="eyebrow eyebrow--center">
            <span className="eyebrow__icon"><Icon d={I.chat} /></span>
            Free setup call
          </span>
          <h1 className="h1">Book a free 15-min setup call</h1>
          <p className="lead">
            Pick a time that suits you. We&apos;ll confirm it on WhatsApp, then help you set up your store, payments and shipping — free.
          </p>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 90 }}>
        <BookCallForm whatsapp={WHATSAPP} />
      </section>
    </>
  );
}
