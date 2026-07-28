/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f14',
        surface: '#0f1722',
        panel: 'rgba(255,255,255,0.045)',
        border: 'rgba(148,163,184,0.18)',
        text: '#e6edf3',
        muted: '#94a3b8',
        accent: '#38bdf8',
        accent2: '#a78bfa',
        primary: '#60a5fa',
        ok: '#34d399',
      },
      boxShadow: {
        glow: '0 22px 65px rgba(0,0,0,0.32)',
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
