import Container from '../Container';
import Reveal from '../Reveal';
import { profile } from '../../data/profile';

const contacts = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'Phone', value: profile.phone.label, href: profile.phone.href, external: false },
  { label: 'GitHub', value: 'github.com/tamtnts', href: profile.github, external: true },
  { label: 'LinkedIn', value: profile.name, href: profile.linkedin, external: true },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-shell scroll-mt-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/[0.12] via-surface to-bg p-7 sm:p-10 lg:p-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Contact</p>
                <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight text-text sm:text-5xl">
                  Let&apos;s build something reliable.
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-muted">
                  I am open to Java backend opportunities and freelance projects involving APIs, databases, event processing, or service integration.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="tech-chip tech-chip-core">{profile.location}</span>
                  {profile.workModes.map((mode) => <span key={mode} className="tech-chip">{mode}</span>)}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {contacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-xl border border-border bg-bg/55 px-4 py-3.5 text-text no-underline transition hover:border-accent/40 hover:bg-bg/80"
                  >
                    <span>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70">{contact.label}</span>
                      <span className="mt-1 block text-sm font-semibold">{contact.value}</span>
                    </span>
                    <span className="text-muted transition group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
