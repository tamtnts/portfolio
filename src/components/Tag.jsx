export default function Tag({ children }) {
  return (
    <span className="rounded-full border border-border bg-white/5 px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}
