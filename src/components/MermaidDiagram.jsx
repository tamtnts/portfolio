import { useEffect, useId, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { renderMermaid } from '../lib/mermaid';

export default function MermaidDiagram({
  code,
  title,
  descriptionId,
  className = '',
  preview = false,
  onOpen,
}) {
  const [renderState, setRenderState] = useState({
    code,
    status: 'loading',
    svg: null,
  });
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const renderCount = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const renderId = `mermaid-${baseId}-${renderCount.current += 1}`;

    renderMermaid(code, renderId)
      .then((svg) => {
        if (!cancelled) setRenderState({ code, status: 'ready', svg });
      })
      .catch(() => {
        if (!cancelled) setRenderState({ code, status: 'error', svg: null });
      });

    return () => {
      cancelled = true;
    };
  }, [baseId, code]);

  if (renderState.code !== code || renderState.status === 'loading') {
    return (
      <div data-diagram-status='loading' role='status' className='rounded-xl border border-border bg-white/5 p-3 font-mono text-xs text-muted'>
        Rendering architecture diagram...
      </div>
    );
  }

  if (renderState.status === 'error') {
    return (
      <div data-diagram-status='error' role='alert' className='rounded-xl border border-border bg-white/5 p-3 font-mono text-xs text-muted'>
        Architecture diagram could not be rendered.
      </div>
    );
  }

  if (preview) {
    return (
      <div data-diagram-status='ready' className={`overflow-hidden rounded-xl border border-border bg-bg/60 ${className}`.trim()}>
        <button
          type='button'
          aria-label={`Open ${title} architecture`}
          className='block w-full cursor-zoom-in p-4 text-left transition hover:bg-white/5 focus-visible:bg-white/5'
          onClick={() => onOpen?.()}
        >
          <span
            role='img'
            aria-label={title}
            aria-describedby={descriptionId}
            className='block w-full max-w-full overflow-hidden [&_svg]:!h-auto [&_svg]:!w-full [&_svg]:!max-w-full'
            dangerouslySetInnerHTML={{ __html: renderState.svg }}
          />
        </button>
      </div>
    );
  }

  return (
    <div data-diagram-status='ready' className={`overflow-hidden rounded-xl border border-border bg-bg/60 ${className}`.trim()}>
      <TransformWrapper
        minScale={0.5}
        maxScale={4}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className='flex justify-end gap-2 border-b border-border bg-panel p-2'>
              <button type='button' aria-label='Zoom in' className='min-h-11 min-w-11 rounded border border-border px-2 py-1 text-sm text-text transition hover:border-accent hover:text-accent' onClick={() => zoomIn()}>
                +
              </button>
              <button type='button' aria-label='Zoom out' className='min-h-11 min-w-11 rounded border border-border px-2 py-1 text-sm text-text transition hover:border-accent hover:text-accent' onClick={() => zoomOut()}>
                −
              </button>
              <button type='button' aria-label='Reset diagram' className='min-h-11 min-w-11 rounded border border-border px-2 py-1 text-xs text-text transition hover:border-accent hover:text-accent' onClick={() => resetTransform()}>
                Reset
              </button>
            </div>
            <TransformComponent
              wrapperClass='w-full cursor-grab overflow-hidden active:cursor-grabbing'
              contentClass='w-full'
              wrapperStyle={{ width: '100%' }}
              contentStyle={{ width: '100%' }}
            >
              <div
                role='img'
                aria-label={title}
                aria-describedby={descriptionId}
                className='w-full max-w-full overflow-hidden p-4 [&_svg]:!h-auto [&_svg]:!w-full [&_svg]:!max-w-full'
                dangerouslySetInnerHTML={{ __html: renderState.svg }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
