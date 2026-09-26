import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full transition-all duration-200";

  const variants = {
    primary:
      "bg-accent text-accent-fg border border-accent hover:bg-accent-dark hover:border-accent-dark",
    ghost:
      "bg-transparent text-foreground border border-border-strong hover:border-foreground",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const classes = `${base} ${variants[variant]} ${disabledStyles} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}