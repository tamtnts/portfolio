import Reveal from '../Reveal';
import { profile } from '../../data/profile';

function TimelineEntry({ label, title, organization, children }) {
  return (
    <article className="relative grid gap-3 pl-7 md:grid-cols-[11rem_1fr] md:gap-6 md:pl-0">
      <div className="font-mono text-xs text-muted">{label}</div>
      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent md:left-[10.8rem]" aria-hidden="true" />
      <div>
        <h3 className="text-lg font-bold text-text">{title}</h3>
        <p className="mt-1 text-sm text-muted">{organization}</p>
        {children}
      </div>
    </article>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20">
      <Reveal>
        <div className="font-mono text-xs text-muted">Experience</div>
        <h2 className="mt-2 text-xl font-black text-text">Where I have contributed</h2>
      </Reveal>
      <div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-px before:bg-border md:before:left-[10.95rem]">
        {profile.experience.map((item) => (
          <Reveal key={`${item.company}-${item.role}`}>
            <TimelineEntry
              label={item.period ? item.period.replace(' - ', ' to ') : item.role}
              title={item.company}
              organization={item.role}
            >
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </TimelineEntry>
          </Reveal>
        ))}
        <Reveal>
          <TimelineEntry
            label={profile.education.period.replace(' - ', ' to ')}
            title={profile.education.school}
            organization={profile.education.degree}
          >
            <p className="mt-3 text-sm text-muted">{profile.education.classification} classification</p>
          </TimelineEntry>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto]">
        <Reveal>
          <div>
            <h3 className="font-mono text-xs text-muted">Certifications</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {profile.certifications.map((certification) => (
                <li key={certification.name}>
                  <a className="text-text underline decoration-border underline-offset-4 transition hover:text-accent" href={certification.url} target="_blank" rel="noreferrer">
                    {certification.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="md:max-w-xs">
            <h3 className="font-mono text-xs text-muted">English</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{profile.english}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
