import Container from '../Container';
import { profile } from '../../data/profile';

export default function HeroSection() {
  return (
    <section id="about" className="relative isolate overflow-hidden scroll-mt-20">
      <Container className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center py-20 sm:py-28">
        <div className="max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ok/25 bg-ok/10 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ok">
            <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            {profile.status}
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.045em] text-text sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-5 text-xl font-semibold text-text/90 sm:text-2xl">
            {profile.role}
          </p>
          <p className="mt-6 font-mono text-sm tracking-widest text-accent sm:text-base">
            JAVA · SPRING BOOT · DATA &amp; SERVICE INTEGRATIONS
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a className="button-primary" href="#projects">View Case Studies</a>
            <a className="button-secondary" href="#contact">Contact Me</a>
            {profile.resumeUrl && (
              <a
                className="button-secondary"
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >View CV</a>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="text-accent" aria-hidden="true">//</span>
              {profile.location}
            </span>
            <span>{profile.workModes.join(' · ')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
