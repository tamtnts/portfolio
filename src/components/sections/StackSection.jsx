import Card from '../Card';
import Reveal from '../Reveal';
import { profile } from '../../data/profile';

const toolEmoji = {
  'Java (Spring Boot)': '☕',
  'Netty / TCP': '🪄',
  'Kafka': '💻',
  'EMQX / MQTT': '🏃',
  'Redis': '⚡',
  'Oracle DB': '🚪',
  'PostgreSQL': '🐘',
  'MongoDB': '🐊',
  'Elasticsearch': '🔎',
  'Kubernetes': '⚛️',
  'Rancher': '🐮',
  'Nginx': '🚦',
  'Grafana': '📊',
  'GitLab CI': '🔥',
  'Linux': '🐧',
  'MinIO / S3': '📦',
};

const groups = [
  { title: 'CORE STACK', items: profile.stack.core },
  { title: 'INFRASTRUCTURE', items: profile.stack.infrastructure },
];

function ToolPill({ name }) {
  const emoji = toolEmoji[name];

  return (
    <li className='inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted sm:text-sm'>
      <span
        aria-hidden='true'
        className='w-4 shrink-0 text-center text-sm leading-none'
        style={{ fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}
      >
        {emoji}
      </span>
      <span>{name}</span>
    </li>
  );
}

export default function StackSection() {
  return (
    <section id='tech-stack' className='scroll-mt-20'>
      <Reveal>
        <div className='font-mono text-xs text-muted'>Tech Stack</div>
        <h2 className='mt-2 text-xl font-black text-text'>Tools I ship with</h2>
      </Reveal>
      <div className='mt-7 grid gap-4 md:grid-cols-2'>
        {groups.map((group) => (
          <Reveal key={group.title}>
            <Card className='h-full p-5 sm:p-6'>
              <h3 className='font-mono text-[11px] font-bold tracking-[0.08em] text-muted'>
                {group.title}
              </h3>
              <ul className='mt-5 flex flex-wrap gap-2'>
                {group.items.map((item) => <ToolPill key={item} name={item} />)}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
