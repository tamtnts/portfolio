import Container from '../Container';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { profile } from '../../data/profile';

const groups = [
  { key: 'backend', label: 'Backend', note: 'Core service development' },
  { key: 'dataMessaging', label: 'Data & Messaging', note: 'Persistence, search, and events' },
  { key: 'delivery', label: 'Delivery', note: 'Repeatable environments' },
];

export default function StackSection() {
  return (
    <section id="stack" className="section-shell border-y border-border bg-surface/35 scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Technical Stack"
            title="Tools I work with"
            description="A Java-first stack for building APIs, integrating services, processing events, and working efficiently with operational data."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {groups.map((group) => (
            <Reveal key={group.key}>
              <article className="h-full rounded-2xl border border-border bg-bg/55 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{group.note}</p>
                <h3 className="mt-3 text-lg font-bold text-text">{group.label}</h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.stack[group.key].map((item) => (
                    <span key={item} className="tech-chip tech-chip-core">{item}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div className="rounded-2xl border border-border bg-bg/35 p-6">
            <div className="grid gap-5 lg:grid-cols-[12rem_1fr] lg:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">Supporting skills</p>
                <p className="mt-2 text-sm leading-6 text-muted">Broader tools from earlier full-stack work.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.stack.supporting.map((item) => (
                  <span key={item} className="tech-chip">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
