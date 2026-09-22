import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

const POSTS = [
  {
    title: "Building the A45: notes from the field",
    excerpt: "Six months of prototyping, three failed frame designs, and one trek above 4,000m to get it right.",
    date: "Field Notes",
  },
  {
    title: "What weatherproofing actually means",
    excerpt: "Not all 'waterproof' claims are equal. Here's how we test ours before it ships.",
    date: "Field Notes",
  },
  {
    title: "Packing for altitude: a technical checklist",
    excerpt: "What actually earns a place in your pack above the treeline.",
    date: "Field Notes",
  },
];

export default function JournalPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24">
        <div className="text-[11px] tracking-[0.2em] uppercase text-foreground-faint mb-4">
          Field notes
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-12">
          Journal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <div key={post.title} className="border-t border-border pt-5">
              <div className="text-[10px] tracking-[0.14em] uppercase text-foreground-faint mb-3">
                {post.date}
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-lg mb-2">
                {post.title}
              </h2>
              <p className="text-foreground-dim text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Container>
  );
}