import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: ReactNode;
  className?: string;
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full transition-all duration-200";

  const variants = {
    primary:
      "bg-accent text-accent-fg border border-accent hover:bg-accent-dark hover:border-accent-dark",
    ghost:
      "bg-transparent text-foreground border border-border-strong hover:border-foreground",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}