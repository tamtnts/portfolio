import { Helmet } from 'react-helmet-async';
import TableOfContents from '../components/TableOfContents';
import ContactSection from '../components/sections/ContactSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import FocusSection from '../components/sections/FocusSection';
import HeroSection from '../components/sections/HeroSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import StackSection from '../components/sections/StackSection';
import Container from '../components/Container';
import { profile } from '../data/profile';

const title = 'Nguyen Thanh Tam - Java Backend Developer';
const siteUrl = 'https://tamtnts.github.io/portfolio';
const description =
  'Portfolio of Nguyen Thanh Tam, a Java Backend Developer building maintainable REST APIs, data services, and backend integrations.';

export default function Home() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phone.label,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
      addressCountry: 'VN',
    },
    url: `${siteUrl}/`,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [
      ...profile.stack.core,
      ...profile.stack.infrastructure,
    ],
  };

  return (
    <>
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:image" content={`${siteUrl}/og.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <HeroSection />
      <Container className="pb-24">
        <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-12">
          <aside className="relative">
            <TableOfContents />
          </aside>
          <main className="space-y-24">
            <FocusSection />
            <StackSection />
            <ProjectsSection />
            <ExperienceSection />
            <ContactSection />
          </main>
        </div>
      </Container>
    </>
  );
}
