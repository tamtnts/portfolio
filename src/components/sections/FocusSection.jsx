import Reveal from '../Reveal';
import { profile } from '../../data/profile';

export default function FocusSection() {
  return (
    <section id="highlights" className="scroll-mt-20">
      <Reveal>
        <div className="font-mono text-xs text-muted">Highlights</div>
        <h2 className="mt-2 text-xl font-black text-text">What I build and improve</h2>
      </Reveal>
      <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {profile.focus.map((item) => (
          <Reveal key={item.title}>
            <article className="border-l-2 border-white/10 pl-4 transition hover:border-accent/40">
              <h3 className="text-lg font-bold text-text/90">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
