import Container from '../Container';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { profile } from '../../data/profile';

export default function EducationSection() {
  return (
    <section id="education" className="section-shell border-y border-border bg-surface/35 scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Education & Certifications"
            title="Learning foundation"
            description="Formal software engineering education supported by continued learning across development, ethics, and project delivery."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <article className="h-full rounded-2xl border border-accent/20 bg-accent/[0.045] p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Education</p>
              <h3 className="mt-5 text-2xl font-bold text-text">{profile.education.school}</h3>
              <p className="mt-3 text-muted">{profile.education.degree}</p>
              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted/70">Period</p>
                  <p className="mt-2 text-text">{profile.education.period}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted/70">Classification</p>
                  <p className="mt-2 text-text">{profile.education.classification}</p>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-bg/40 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted/70">English</p>
                <p className="mt-2 text-sm leading-6 text-muted">{profile.english}</p>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-bg/45">
              {profile.certifications.map((certificate, index) => (
                <a
                  key={certificate.name}
                  href={certificate.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 border-b border-border px-5 py-5 text-text no-underline transition last:border-b-0 hover:bg-white/[0.04] sm:px-6"
                >
                  <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
                  <span className="flex-1 text-sm font-semibold leading-6">{certificate.name}</span>
                  <span className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true">↗</span>
                  <span className="sr-only">Open certificate</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
