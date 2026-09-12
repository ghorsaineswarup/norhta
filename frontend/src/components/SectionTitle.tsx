export default function SectionTitle({ children }: { children: string }) {
  return (
    <div className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] uppercase text-foreground-faint mb-5">
      {children}
    </div>
  );
}