import { useEffect, useState } from 'react';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'focus', label: 'Focus' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'earlier-projects', label: 'Earlier work' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export default function TableOfContents() {
  const [activeId, setActiveId] = useState('about');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block" aria-label="Page sections">
      <ol className="space-y-1 border-l border-border py-2">
        {sections.map(({ id, label }, index) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? 'location' : undefined}
                className={`group flex items-center gap-3 border-l px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider no-underline transition ${active ? '-ml-px border-accent text-accent' : '-ml-px border-transparent text-muted/55 hover:text-text'}`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className={active ? 'opacity-100' : 'opacity-0 transition group-hover:opacity-100'}>{label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
