import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block font-[family-name:var(--font-display)] text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-transparent border border-border-strong rounded-md px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-accent transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}