import { profile } from '../data/profile';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono">
          &copy; {new Date().getFullYear()} {profile.name}
        </div>
        <div>Java backend engineering portfolio.</div>
      </Container>
    </footer>
  );
}
