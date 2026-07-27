/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111f',
        surface: '#0b1728',
        panel: 'rgba(255,255,255,0.045)',
        border: 'rgba(148,163,184,0.18)',
        text: '#e8f2ff',
        muted: '#9fb0c4',
        accent: '#67e8f9',
        accentStrong: '#22d3ee',
        ok: '#34d399',
      },
      boxShadow: {
        console: '0 28px 90px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.035)',
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
