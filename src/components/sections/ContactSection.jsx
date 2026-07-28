import Card from '../Card';
import Reveal from '../Reveal';
import Tag from '../Tag';
import { profile } from '../../data/profile';

const contacts = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'Phone', value: profile.phone.label, href: profile.phone.href, external: false },
  { label: 'GitHub', value: 'github.com/tamtnts', href: profile.github, external: true },
  { label: 'LinkedIn', value: profile.name, href: profile.linkedin, external: true },
];

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20">
      <Reveal>
        <div className="font-mono text-xs text-muted">Contact</div>
        <h2 className="mt-2 text-xl font-black text-text">Let&apos;s connect</h2>
      </Reveal>
      <Reveal className="mt-6">
        <Card className="p-5">
          <div className="flex flex-wrap gap-2">
            <Tag>{profile.location}</Tag>
            {profile.workModes.map((mode) => <Tag key={mode}>{mode}</Tag>)}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noreferrer' : undefined}
                className="group rounded-xl border border-border bg-bg/45 px-4 py-3 text-text no-underline transition hover:border-accent/40"
              >
                <span className="block font-mono text-[10px] text-muted">{contact.label}</span>
                <span className="mt-1 block text-sm font-semibold">{contact.value}</span>
              </a>
            ))}
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
