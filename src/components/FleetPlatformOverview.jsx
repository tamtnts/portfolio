import Card from './Card';
import C4DiagramSummary from './C4DiagramSummary';
import MermaidDiagram from './MermaidDiagram';

export default function FleetPlatformOverview({ platform, onOpenDiagram }) {
  const context = platform.c4.context;
  const descriptionId = 'fleet-platform-c1-summary';

  return (
    <div data-c4-level={context.level}>
      <Card className='mt-8 overflow-hidden p-5 sm:p-6'>
        <div className='grid gap-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] xl:items-center'>
          <div>
            <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-accent'>Connected platform</p>
            <h3 className='mt-2 text-2xl font-black tracking-tight text-text'>{platform.name}</h3>
            <p className='mt-3 text-sm leading-6 text-muted'>{platform.summary}</p>
            <p className='mt-4 border-l-2 border-accent/40 pl-3 text-xs leading-5 text-muted'>{platform.disclaimer}</p>
          </div>
          <C4DiagramSummary id={descriptionId} diagram={context} />
          <MermaidDiagram
            title={`${context.level} \u2014 ${context.title}`}
            code={context.code}
            descriptionId={descriptionId}
            preview
            onOpen={() => onOpenDiagram?.(context)}
          />
        </div>
      </Card>
    </div>
  );
}
