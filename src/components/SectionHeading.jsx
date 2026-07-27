export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <header className="max-w-2xl">
      <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-8 bg-accent/70" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>
      )}
    </header>
  );
}
