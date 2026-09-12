type BadgeProps = {
  children: string;
  variant?: "default" | "accent" | "outline";
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-card text-foreground-dim border border-border",
    accent: "bg-accent text-accent-fg border border-accent",
    outline: "bg-transparent text-foreground-dim border border-border-strong",
  };
  return (
    <span
      className={`inline-block text-[11px] tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full ${variants[variant]}`}
    >
      {children}
    </span>
  );
}