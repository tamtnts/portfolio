import { Link } from 'react-router-dom';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <article className="project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Case study / 0{index + 1}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted">
          NDA-safe
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-2xl font-black tracking-tight text-text sm:text-3xl">
          <Link
            className="text-text no-underline transition group-hover:text-accent"
            to={`/projects/${project.slug}`}
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 text-sm leading-6 text-muted">{project.subtitle}</p>

        <div className="mt-6 rounded-xl border border-border bg-bg/35 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70">Role & scope</p>
          <p className="mt-2 text-sm font-semibold text-text">{project.role}</p>
          <p className="mt-2 text-xs leading-5 text-muted">
            {project.modules.slice(0, 3).join(' · ')}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tech-chip">{tag}</span>
          ))}
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="mt-7 flex items-center justify-between border-t border-border pt-5 text-sm font-bold text-text no-underline transition hover:text-accent"
          aria-label={`Read the ${project.title} case study`}
        >
          Read case study
          <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
