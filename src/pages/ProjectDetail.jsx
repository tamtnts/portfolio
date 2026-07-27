import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Container from '../components/Container';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

const siteUrl = 'https://tamtnts.github.io/portfolio';

function CaseSection({ label, title, children }) {
  return (
    <section className="border-t border-border py-10 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{label}</p>
          <h2 className="mt-3 text-xl font-bold text-text">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="grid gap-3 text-sm leading-7 text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl border border-border bg-panel px-4 py-3.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main>
        <Helmet>
          <title>{`Project Not Found | ${profile.name}`}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Container className="flex min-h-[70svh] items-center py-20">
          <div className="w-full rounded-2xl border border-border bg-panel p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">404 / Case study</p>
            <h1 className="mt-4 text-3xl font-black text-text">Project not found</h1>
            <p className="mt-3 text-muted">This case study is not part of the published portfolio.</p>
            <Link className="button-secondary mt-7" to="/">Return home</Link>
          </div>
        </Container>
      </main>
    );
  }

  const title = `${project.title} - Case Study | ${profile.name}`;
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;

  return (
    <main>
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={project.subtitle} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={project.subtitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${siteUrl}/og.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="relative overflow-hidden border-b border-border">
        <div className="hero-grid absolute inset-0 -z-20" aria-hidden="true" />
        <div className="hero-glow absolute inset-0 -z-10" aria-hidden="true" />
        <Container className="py-16 sm:py-20 lg:py-24">
          <Link className="inline-flex items-center gap-2 text-sm text-muted no-underline transition hover:text-accent" to="/">
            <span aria-hidden="true">←</span> Back to portfolio
          </Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-accent/25 bg-accent/[0.07] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                NDA-safe case study
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-text sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{project.subtitle}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface/80 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">Contribution</p>
              <p className="mt-3 font-semibold text-text">{project.role}</p>
              <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted">
                Business and customer details are intentionally anonymized.
              </p>
            </div>
          </div>
        </Container>
      </header>

      <article>
        <Container className="py-4 sm:py-8">
          <CaseSection label="01 / Context" title="Context">
            <p className="max-w-3xl text-base leading-8 text-muted">{project.context}</p>
          </CaseSection>

          <CaseSection label="02 / Contribution" title="Role & responsibilities">
            <BulletList items={project.contributions} />
          </CaseSection>

          <CaseSection label="03 / Scope" title="Key modules">
            <div className="grid gap-3 sm:grid-cols-2">
              {project.modules.map((module, index) => (
                <div key={module} className="rounded-xl border border-border bg-panel p-4">
                  <span className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-3 text-sm font-semibold text-text">{module}</p>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection label="04 / System flow" title="Architecture & data flow">
            <div className="grid gap-2 md:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[repeat(6,minmax(0,1fr))]">
              {project.dataFlow.map((step, index) => (
                <div key={step} className="relative flex min-h-24 flex-col justify-between rounded-xl border border-accent/20 bg-accent/[0.045] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-accent">Step {String(index + 1).padStart(2, '0')}</span>
                  <span className="mt-4 text-xs font-semibold leading-5 text-text">{step}</span>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection label="05 / Trade-offs" title="Technical decisions">
            <BulletList items={project.decisions} />
          </CaseSection>

          <CaseSection label="06 / Problem solving" title="Challenges">
            <BulletList items={project.challenges} />
          </CaseSection>

          <CaseSection label="07 / Tooling" title="Technology stack">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => <span key={tag} className="tech-chip tech-chip-core">{tag}</span>)}
            </div>
          </CaseSection>

          <CaseSection label="08 / Impact" title="Outcome">
            <BulletList items={project.outcome} />
          </CaseSection>

          <CaseSection label="09 / Reflection" title="Lessons learned">
            <BulletList items={project.lessons} />
          </CaseSection>

          <div className="py-12 text-center">
            <p className="font-mono text-xs text-muted">End of case study</p>
            <Link className="button-primary mt-5" to="/#projects">Explore other work</Link>
          </div>
        </Container>
      </article>
    </main>
  );
}
