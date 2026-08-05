import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Card from '../components/Card';
import C4Model from '../components/C4Model';
import Container from '../components/Container';
import Tag from '../components/Tag';
import NotFoundPage from './NotFoundPage';
import { fleetPlatform } from '../data/fleetPlatform';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

const siteUrl = 'https://tamtnts.github.io/portfolio';

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

function Section({ title, children, when = true }) {
  if (!when) return null;

  return (
    <section className='mt-6'>
      <h2 className='font-mono text-xs text-muted'>{title}</h2>
      <div className='mt-2'>{children}</div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className='grid gap-3 text-sm leading-7 text-muted'>
      {items.map((item) => {
        if (typeof item === 'string') {
          return (
            <li key={item} className='flex gap-3'>
              <span aria-hidden='true' className='mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
              <span>{item}</span>
            </li>
          );
        }

        return (
          <li key={item.phase}>
            <strong className='text-text'>{item.phase}</strong>
            <ol className='mt-2 list-decimal space-y-1 pl-5'>
              {item.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const title = project
    ? project.title + ' - Case Study | ' + profile.name
    : 'Project Not Found | ' + profile.name;

  if (!project) {
    return (
      <NotFoundPage
        eyebrow='404 / Case study'
        heading='Project not found'
        message='This case study is not part of the published portfolio.'
        metaTitle={title}
      />
    );
  }

  const relatedProjects = projects.filter((item) => item.slug !== project.slug);
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;

  return (
    <main>
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name='description' content={project.subtitle} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={project.subtitle} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={`${siteUrl}/og.svg`} />
        <meta name='twitter:card' content='summary_large_image' />
      </Helmet>

      <Container className='py-12 sm:py-16'>
        <header>
          <p className='font-mono text-xs uppercase tracking-[0.18em] text-accent'>{project.serviceLabel}</p>
          <h1 className='mt-4 text-4xl font-black tracking-tight text-text sm:text-5xl'>{project.title}</h1>
          <p className='mt-4 max-w-3xl text-lg leading-8 text-muted'>{project.subtitle}</p>
          <div className='mt-5 flex flex-wrap gap-2'>
            {project.tags.map((technology) => <Tag key={technology}>{technology}</Tag>)}
          </div>
          <Card className='mt-6 p-5'>
            <p className='font-mono text-xs text-muted'>Confidentiality note</p>
            <p className='mt-2 text-sm leading-6 text-muted'>{project.disclaimer}</p>
          </Card>
          <Link className='button-secondary mt-6' to='/#projects'>Back to portfolio</Link>
        </header>

        <article className='mt-8'>
          <Section title='Overview' when={hasContent(project.overview)}>
            <Card className='p-5'>
              <div className='grid gap-3 text-sm text-muted sm:grid-cols-2'>
                {project.overview.domain && <div><span className='font-mono text-xs'>Domain:</span> {project.overview.domain}</div>}
                {project.overview.duration && <div><span className='font-mono text-xs'>Duration:</span> {project.overview.duration}</div>}
                {project.overview.teamSize && <div><span className='font-mono text-xs'>Team size:</span> {project.overview.teamSize}</div>}
                {project.overview.scale && <div className='sm:col-span-2'><span className='font-mono text-xs'>Scale:</span> {project.overview.scale}</div>}
                {project.overview.platform && <div className='sm:col-span-2'><span className='font-mono text-xs'>Platform:</span> {project.overview.platform}</div>}
              </div>
            </Card>
          </Section>

          <Section title='Requirements' when={hasContent(project.requirements)}>
            <Card className='p-5'><List items={project.requirements} /></Card>
          </Section>

          <Section title='Key Challenges' when={hasContent(project.challenges)}>
            <Card className='p-5'><List items={project.challenges} /></Card>
          </Section>

          <Section title='C4 Model'>
            <C4Model
              context={fleetPlatform.c4.context}
              container={project.c4.container}
              component={project.c4.component}
            />
          </Section>

          <Section title='Main Flow' when={hasContent(project.mainFlow)}>
            <Card className='p-5'><List items={project.mainFlow} /></Card>
          </Section>

          <Section title='My Contributions' when={hasContent(project.contributions)}>
            <Card className='p-5'><List items={project.contributions} /></Card>
          </Section>

          <Section title='Tech Stack' when={hasContent(project.techStack)}>
            <Card className='p-5'>
              <div className='flex flex-wrap gap-2'>
                {project.techStack.map((technology) => <Tag key={technology}>{technology}</Tag>)}
              </div>
            </Card>
          </Section>

          <Section title='Reliability & Security' when={hasContent(project.reliabilitySecurity)}>
            <Card className='p-5'><List items={project.reliabilitySecurity} /></Card>
          </Section>

          <Section title='Trade-offs / Design Decisions' when={hasContent(project.tradeoffs)}>
            <Card className='p-5'><List items={project.tradeoffs} /></Card>
          </Section>

          <Section title='Outcome / Impact' when={hasContent(project.outcome)}>
            <Card className='p-5'><List items={project.outcome} /></Card>
          </Section>

          <Section title='Lessons Learned' when={hasContent(project.lessons)}>
            <Card className='p-5'><List items={project.lessons} /></Card>
          </Section>

          <Section title='Related Platform Services' when={relatedProjects.length > 0}>
            <div className='grid gap-3 sm:grid-cols-2'>
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.slug}
                  className='rounded-xl border border-border bg-panel p-5 text-text no-underline transition hover:border-accent/40 hover:bg-white/[0.06]'
                  to={`/projects/${relatedProject.slug}`}
                  aria-label={`Read the ${relatedProject.title} case study`}
                >
                  <span className='font-mono text-[10px] uppercase tracking-[0.18em] text-accent'>
                    {relatedProject.serviceLabel}
                  </span>
                  <span className='mt-2 block text-lg font-bold'>{relatedProject.title}</span>
                  <span className='mt-2 block text-sm leading-6 text-muted'>{relatedProject.subtitle}</span>
                </Link>
              ))}
            </div>
          </Section>
        </article>
      </Container>
    </main>
  );
}
