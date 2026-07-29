import { useState } from 'react';
import Card from '../Card';
import Container from '../Container';
import DiagramModal from '../DiagramModal';
import FleetPlatformOverview from '../FleetPlatformOverview';
import ProjectCard from '../ProjectCard';
import Reveal from '../Reveal';
import { earlierProjects } from '../../data/earlierProjects';
import { fleetPlatform } from '../../data/fleetPlatform';
import { projects } from '../../data/projects';

export default function ProjectsSection() {
  const [modal, setModal] = useState({
    open: false,
    title: '',
    code: '',
  });

  const openDiagram = (project) => {
    const container = project.c4.container;
    setModal({
      open: true,
      title: `${container.level} â€” ${project.title}: ${container.title}`,
      code: container.code,
    });
  };

  return (
    <section id='projects' className='section-shell scroll-mt-20'>
      <Container>
        <Reveal>
          <div className='font-mono text-xs text-muted'>Featured Projects</div>
          <h2 className='mt-2 text-xl font-black text-text'>Selected backend case studies</h2>
          <p className='mt-3 max-w-2xl text-sm leading-relaxed text-muted'>
            An NDA-safe view of logistics systems I have contributed to, focused on responsibilities, architecture, and engineering decisions.
          </p>
          <FleetPlatformOverview platform={fleetPlatform} />
        </Reveal>
        <div className='mt-10 grid gap-5 lg:grid-cols-3'>
          {projects.map((project, index) => (
            <Reveal key={project.slug}>
              <ProjectCard project={project} index={index} onOpenDiagram={openDiagram} />
            </Reveal>
          ))}
        </div>

        <div className='mt-14'>
          <Reveal>
            <h2 className='text-2xl font-black tracking-tight text-text sm:text-3xl'>Selected Projects</h2>
          </Reveal>
          <div className='mt-8 grid gap-4 md:grid-cols-2'>
            {earlierProjects.map((project) => (
              <Reveal key={project.name}>
                <Card className='flex h-full flex-col p-5'>
                  <h3 className='text-lg font-bold leading-6 text-text'>{project.name}</h3>
                  <p className='mt-3 text-sm leading-6 text-muted'>{project.summary}</p>
                  <ul className='mt-5 space-y-2 text-sm leading-6 text-muted'>
                    {project.responsibilities.map((item) => (
                      <li key={item} className='flex gap-2'>
                        <span className='text-accent' aria-hidden='true'>→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className='mt-auto flex flex-wrap gap-2 pt-6'>
                    {project.technologies.map((technology) => (
                      <span key={technology} className='tech-chip'>{technology}</span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <DiagramModal
        open={modal.open}
        title={modal.title}
        code={modal.code}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
      />
    </section>
  );
}
