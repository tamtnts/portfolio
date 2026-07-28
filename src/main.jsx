import { createRoot } from 'react-dom/client';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';

const isPrerender = typeof window !== 'undefined' && window.__PRERENDER__;
const Router = isPrerender ? StaticRouter : BrowserRouter;

const routerProps = isPrerender
  ? { location: window.location.pathname, basename: import.meta.env.BASE_URL }
  : { basename: import.meta.env.BASE_URL };

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <Router {...routerProps}>
      <App />
    </Router>
  </HelmetProvider>,
);
