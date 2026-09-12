export default function Loader({ size = 24 }: { size?: number }) {
  return (
    <div
      className="border-2 border-border border-t-accent rounded-full animate-spin"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}