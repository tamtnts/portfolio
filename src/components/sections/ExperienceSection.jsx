import Container from '../Container';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { profile } from '../../data/profile';

export default function ExperienceSection() {
  return (
    <section id="experience" className="section-shell border-y border-border bg-surface/35 scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Where I have contributed"
            description="Backend delivery across fleet operations, data synchronization, and the foundations built during software engineering training."
          />
        </Reveal>

        <div className="mt-12 space-y-5">
          {profile.experience.map((item, index) => (
            <Reveal key={`${item.company}-${item.role}`}>
              <article className="relative grid gap-6 rounded-2xl border border-border bg-bg/55 p-6 md:grid-cols-[13rem_1fr] md:p-8">
                <div className="absolute -left-[5px] top-9 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent shadow-[0_0_14px_rgba(103,232,249,0.7)]" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {item.period || `Experience 0${index + 1}`}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-text">{item.company}</h3>
                  <p className="mt-1 text-sm text-muted">{item.role}</p>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-muted">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
