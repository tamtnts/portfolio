import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

// GitHub Pages needs correct base path.
// Set VITE_BASE in GitHub Actions or in your local env.
// Example: VITE_BASE=/your-repo-name/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',

  // Allow ngrok hostnames during dev preview.
  server: {
    host: true,
    port: 8095,
    strictPort: true,
    // Allow ngrok free domains during dev preview
    allowedHosts: ['.ngrok-free.app'],
  },
});
