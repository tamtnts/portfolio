import Container from '../Container';
import ProjectCard from '../ProjectCard';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import { projects } from '../../data/projects';

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-shell scroll-mt-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Featured Projects"
            title="Selected backend case studies"
            description="An NDA-safe view of logistics systems I have contributed to, focused on responsibilities, architecture, and engineering decisions."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
