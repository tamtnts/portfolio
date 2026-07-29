import { profile } from '../data/profile';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted">
        <div className="font-mono">
          &copy; {new Date().getFullYear()} {profile.name}
        </div>
        <div>Middle backend developer portfolio.</div>
      </Container>
    </footer>
  );
}
