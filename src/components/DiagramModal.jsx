import { useEffect, useId, useRef } from 'react';
import MermaidDiagram from './MermaidDiagram';

export default function DiagramModal({ open, title, code, onClose }) {
  const previousFocus = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []);
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements.at(-1);
      if (!firstFocusable || !lastFocusable) return;

      const focusIsOutsideDialog = !dialogRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === firstFocusable || focusIsOutsideDialog)) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && (document.activeElement === lastFocusable || focusIsOutsideDialog)) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm' onClick={() => onClose?.()}>
      <section
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={headingId}
        className='max-h-[90vh] w-full max-w-6xl overflow-auto rounded-2xl border border-border bg-panel p-4 shadow-2xl sm:p-6'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='mb-4 flex items-start justify-between gap-4'>
          <h2 id={headingId} className='text-lg font-bold text-text sm:text-xl'>{title}</h2>
          <button
            ref={closeButtonRef}
            type='button'
            aria-label='Close architecture diagram'
            className='min-h-11 rounded border border-border px-3 py-1.5 text-sm font-semibold text-text transition hover:border-accent hover:text-accent'
            onClick={() => onClose?.()}
          >
            Close
          </button>
        </div>
        <MermaidDiagram code={code} title={title} />
      </section>
    </div>
  );
}
