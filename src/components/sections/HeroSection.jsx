import Container from '../Container';
import { profile } from '../../data/profile';

const primaryStack = ['Java 17', 'Spring Boot', 'PostgreSQL', 'Kafka'];

export default function HeroSection() {
  return (
    <section id="about" className="relative isolate overflow-hidden border-b border-border scroll-mt-20">
      <div className="hero-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-14 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-ok/25 bg-ok/10 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ok">
            <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            {profile.status}
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-muted">
            Hello, I am
          </p>
          <h1 className="mt-3 text-5xl font-black leading-[0.98] tracking-[-0.045em] text-text sm:text-7xl lg:text-[5.5rem]">
            Nguyen Thanh
            <span className="block text-accent">Tam.</span>
          </h1>
          <p className="mt-6 text-xl font-semibold text-text/90 sm:text-2xl">
            {profile.role}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a className="button-primary" href="#projects">View Projects</a>
            <a className="button-secondary" href="#contact">Contact Me</a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="text-accent" aria-hidden="true">//</span>
              {profile.location}
            </span>
            <span>{profile.workModes.join(' · ')}</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-6 -z-10 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="overflow-hidden rounded-2xl border border-accent/20 bg-surface/90 shadow-console backdrop-blur">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
                backend.profile
              </span>
            </div>
            <div className="space-y-5 p-6 font-mono text-sm sm:p-8">
              <div>
                <span className="text-muted">developer</span>
                <span className="text-text"> = </span>
                <span className="text-accent">&quot;{profile.name}&quot;</span>
              </div>
              <div>
                <span className="text-muted">focus</span>
                <span className="text-text"> = </span>
                <span className="text-ok">[APIs, Data, Integration]</span>
              </div>
              <div className="border-t border-border pt-5">
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted/70">Core runtime</p>
                <div className="flex flex-wrap gap-2">
                  {primaryStack.map((item) => (
                    <span key={item} className="rounded-md border border-border bg-white/[0.035] px-2.5 py-1.5 text-xs text-text">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-t border-border pt-5 text-center text-[10px] uppercase tracking-wider">
                <span className="console-node">Request</span>
                <span className="text-accent">→</span>
                <span className="console-node">Service</span>
                <span className="text-accent">→</span>
                <span className="console-node">Data</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
