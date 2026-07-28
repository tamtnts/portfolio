import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Container from '../components/Container';
import { profile } from '../data/profile';

export default function NotFoundPage({
  eyebrow = '404 / Portfolio',
  heading = 'Page not found',
  message = 'The requested page is not part of the published portfolio.',
  metaTitle = `Page Not Found | ${profile.name}`,
}) {
  return (
    <main>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Container className='flex min-h-[70svh] items-center py-20'>
        <Card className='w-full p-8 sm:p-10'>
          <p className='font-mono text-xs uppercase tracking-widest text-accent'>{eyebrow}</p>
          <h1 className='mt-4 text-3xl font-black text-text'>{heading}</h1>
          <p className='mt-3 text-muted'>{message}</p>
          <Link className='button-secondary mt-7' to='/'>Return home</Link>
        </Card>
      </Container>
    </main>
  );
}
