import Container from '../Container';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { earlierProjects } from '../../data/earlierProjects';

export default function EarlierProjectsSection() {
  return (
    <section id="earlier-projects" className="section-shell scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Earlier Projects"
            title="Foundations and earlier work"
            description="Selected academic and internship work that shaped my database, API, testing, and delivery fundamentals."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {earlierProjects.map((project, index) => (
            <Reveal key={project.name}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-panel p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Archive / 0{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold leading-6 text-text">{project.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{project.summary}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-muted">
                  {project.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {project.technologies.map((item) => (
                    <span key={item} className="tech-chip">{item}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
