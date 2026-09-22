import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

const FAQS = [
  { q: "How long does shipping take?", a: "1–2 days within Kathmandu Valley, 3–5 days elsewhere in Nepal." },
  { q: "What payment methods do you accept?", a: "eSewa, Khalti, and Cash on Delivery." },
  { q: "What is your warranty policy?", a: "NORHTA products include a limited two-year manufacturing warranty." },
  { q: "Can I track my order?", a: "Yes — order status is visible in your account under Orders." },
];

export default function FaqPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">FAQ</h1>
        <div className="space-y-6">
          {FAQS.map((item) => (
            <div key={item.q} className="border-b border-border pb-5">
              <div className="text-sm font-medium mb-1.5">{item.q}</div>
              <div className="text-foreground-dim text-sm">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Container>
  );
}