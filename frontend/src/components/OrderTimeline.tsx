const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="text-sm text-accent border border-accent rounded-full px-3 py-1 inline-block">
        Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  done ? "bg-accent text-black" : "bg-card border border-border text-foreground-faint"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[9px] tracking-[0.08em] uppercase mt-1.5 capitalize ${
                  done ? "text-accent" : "text-foreground-faint"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${i < currentIndex ? "bg-accent" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}