import { Link } from 'react-router-dom';

export default function ProjectCard({ project, index = 0, onOpenDiagram }) {
  return (
    <article className='project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-panel'>
      <div className='flex items-center justify-between border-b border-border px-6 py-4'>
        <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-accent'>
          Case study / 0{index + 1}
        </span>
        <span className='rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted'>
          NDA-safe
        </span>
      </div>
      <div className='flex flex-1 flex-col p-6 sm:p-7'>
        <h3 className='text-2xl font-black tracking-tight text-text sm:text-3xl'>
          <Link
            className='text-text no-underline transition group-hover:text-accent'
            to={`/projects/${project.slug}`}
          >
            {project.title}
          </Link>
        </h3>
        <p className='mt-4 text-sm leading-6 text-muted'>{project.subtitle}</p>

        <div className='mt-5 flex flex-wrap gap-2'>
          {project.tags.slice(0, 5).map((tag) => (
            <span key={tag} className='tech-chip'>{tag}</span>
          ))}
        </div>

        {project.scaling && (
          <div className='mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-4'>
            {Object.entries(project.scaling).slice(0, 3).map(([key, value]) => (
              <div key={key} className='min-w-0'>
                <div className='break-words text-base font-black text-white sm:text-xl'>
                  {value.split(' ')[0]}
                </div>
                <div className='mt-1 break-words text-[10px] uppercase tracking-wide text-muted/60'>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='mt-auto grid grid-cols-2 gap-3 pt-7'>
          <Link
            to={`/projects/${project.slug}`}
            className='rounded-lg border border-border px-3 py-2.5 text-center text-sm font-bold text-text no-underline transition hover:border-accent hover:text-accent'
            aria-label={`Read the ${project.title} case study`}
          >
            Read Case Study
          </Link>
          <button
            type='button'
            className='rounded-lg border border-border px-3 py-2.5 text-sm font-bold text-text transition hover:border-accent hover:text-accent'
            aria-label={`Preview the ${project.title} architecture`}
            onClick={() => onOpenDiagram(project)}
          >
            Preview Architecture
          </button>
        </div>
      </div>
    </article>
  );
}
