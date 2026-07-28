import Card from '../Card';
import Reveal from '../Reveal';
import Tag from '../Tag';
import { profile } from '../../data/profile';

const groups = [
  {
    title: 'Core Stack',
    description: 'Java backend, data, search, and messaging tools.',
    items: [...profile.stack.backend, ...profile.stack.dataMessaging],
    core: true,
  },
  {
    title: 'Delivery & Supporting',
    description: 'Delivery tooling and supporting technologies.',
    items: [...profile.stack.delivery, ...profile.stack.supporting],
    core: false,
  },
];

export default function StackSection() {
  return (
    <section id="tech-stack" className="scroll-mt-20">
      <Reveal>
        <div className="font-mono text-xs text-muted">Tech Stack</div>
        <h2 className="mt-2 text-xl font-black text-text">Tools I work with</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <Reveal key={group.title}>
            <Card className={`h-full p-5 ${group.core ? 'border-accent/30 bg-accent/[0.06]' : 'bg-bg/45'}`}>
              <h3 className="text-lg font-bold text-text">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{group.description}</p>
              <div className={`mt-5 flex flex-wrap gap-2 ${group.core ? '[&>span]:border-accent/40 [&>span]:bg-accent/10 [&>span]:text-text' : ''}`}>
                {group.items.map((item) => <Tag key={item}>{item}</Tag>)}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
