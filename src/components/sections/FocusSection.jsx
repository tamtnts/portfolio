import Container from '../Container';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { profile } from '../../data/profile';

export default function FocusSection() {
  return (
    <section id="focus" className="section-shell scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Engineering Focus"
            title="What I build and improve"
            description="Practical backend engineering centered on maintainability, dependable data flow, and systems that are easier for teams to operate."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {profile.focus.map((item, index) => (
            <Reveal key={item.title}>
              <article className="group h-full rounded-2xl border border-border bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:bg-white/[0.065]">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-accent">0{index + 1}</span>
                  <span className="h-2 w-2 rounded-full border border-accent/50 bg-accent/10 transition group-hover:bg-accent" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-text">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
