import { FaJava, FaLinux } from 'react-icons/fa';
import { GrOracle } from 'react-icons/gr';
import { LuNetwork } from 'react-icons/lu';
import {
  SiApachekafka,
  SiElasticsearch,
  SiGitlab,
  SiGrafana,
  SiKubernetes,
  SiMinio,
  SiMongodb,
  SiMqtt,
  SiNginx,
  SiPostgresql,
  SiRancher,
  SiRedis,
} from 'react-icons/si';
import Card from '../Card';
import Reveal from '../Reveal';
import { profile } from '../../data/profile';

const toolIcons = {
  'Java (Spring Boot)': { Icon: FaJava, color: 'text-[#f89820]' },
  'Netty / TCP': { Icon: LuNetwork, color: 'text-[#00a1d6]' },
  Kafka: { Icon: SiApachekafka, color: 'text-text' },
  'EMQX / MQTT': { Icon: SiMqtt, color: 'text-accent2' },
  Redis: { Icon: SiRedis, color: 'text-[#dc382d]' },
  'Oracle DB': { Icon: GrOracle, color: 'text-[#f80000]' },
  PostgreSQL: { Icon: SiPostgresql, color: 'text-[#4169e1]' },
  MongoDB: { Icon: SiMongodb, color: 'text-[#47a248]' },
  Elasticsearch: { Icon: SiElasticsearch, color: 'text-[#00bfb3]' },
  Kubernetes: { Icon: SiKubernetes, color: 'text-[#326ce5]' },
  Rancher: { Icon: SiRancher, color: 'text-[#0075a8]' },
  Nginx: { Icon: SiNginx, color: 'text-[#009639]' },
  Grafana: { Icon: SiGrafana, color: 'text-[#f46800]' },
  'GitLab CI': { Icon: SiGitlab, color: 'text-[#fc6d26]' },
  Linux: { Icon: FaLinux, color: 'text-[#fcc624]' },
  'MinIO / S3': { Icon: SiMinio, color: 'text-[#c72e49]' },
};

const groups = [
  { title: 'CORE STACK', items: profile.stack.core },
  { title: 'INFRASTRUCTURE', items: profile.stack.infrastructure },
];

function ToolPill({ name }) {
  const { Icon, color } = toolIcons[name];

  return (
    <li className='inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted sm:text-sm'>
      <Icon aria-hidden='true' className={`shrink-0 text-sm ${color}`} />
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
