import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import Container from './Container';

export default function Navbar() {
  const location = useLocation();
  const homeUrl = import.meta.env.BASE_URL;

  const handleHomeAnchor = (event, id) => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-xl">
      <Container className="flex min-h-14 items-center justify-between gap-4">
        <Link
          to="/"
          className="font-mono text-sm font-bold tracking-tight text-text no-underline"
        >
          {profile.shortName}<span className="text-accent">@backend</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-4 text-sm">
          <a
            href={`${homeUrl}#projects`}
            onClick={(event) => handleHomeAnchor(event, 'projects')}
            className="text-muted no-underline transition hover:text-text"
          >
            Projects
          </a>
          <a
            href={`${homeUrl}#contact`}
            onClick={(event) => handleHomeAnchor(event, 'contact')}
            className="text-muted no-underline transition hover:text-text"
          >
            Contact
          </a>
        </nav>
      </Container>
    </header>
  );
}
