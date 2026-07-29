import Card from './Card';
import C4DiagramSummary from './C4DiagramSummary';
import MermaidDiagram from './MermaidDiagram';

export default function C4Model({ context, container, component }) {
  const levels = [context, container, component];

  return (
    <div className='grid gap-4'>
      {levels.map((diagram) => {
        const descriptionId = `c4-${diagram.level.toLowerCase()}-summary`;

        return (
          <div key={diagram.level} data-c4-level={diagram.level}>
            <Card className='p-5'>
              <p className='font-mono text-[10px] uppercase tracking-[0.18em] text-accent'>{diagram.level}</p>
              <h3 className='mt-2 text-lg font-bold text-text'>{diagram.title}</h3>
              <p className='mt-2 text-sm leading-6 text-muted'>{diagram.description}</p>
              <C4DiagramSummary id={descriptionId} diagram={diagram} />
              <div className='mt-4'>
                <MermaidDiagram
                  title={`${diagram.level} \u2014 ${diagram.title}`}
                  code={diagram.code}
                  descriptionId={descriptionId}
                />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
