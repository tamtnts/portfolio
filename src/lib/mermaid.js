import mermaid from 'mermaid';

let initialized = false;

export function initMermaid() {
  if (initialized) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    themeVariables: {
      background: '#0b0f14',
      primaryColor: '#111827',
      primaryTextColor: '#e6edf3',
      primaryBorderColor: '#334155',
      lineColor: '#64748b',
      textColor: '#e6edf3',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    },
  });
  initialized = true;
}

export async function renderMermaid(code, id) {
  initMermaid();
  const { svg } = await mermaid.render(id, code);
  return svg;
}
