export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-border bg-panel shadow-glow ${className}`.trim()}>
      {children}
    </div>
  );
}
