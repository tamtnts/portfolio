import { Helmet } from 'react-helmet-async';
import TableOfContents from '../components/TableOfContents';
import ContactSection from '../components/sections/ContactSection';
import EarlierProjectsSection from '../components/sections/EarlierProjectsSection';
import EducationSection from '../components/sections/EducationSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import FocusSection from '../components/sections/FocusSection';
import HeroSection from '../components/sections/HeroSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import StackSection from '../components/sections/StackSection';
import { profile } from '../data/profile';

const title = 'Nguyen Thanh Tam - Java Backend Developer';
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
    url: 'https://tamtnts.github.io/portfolio/',
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [
      ...profile.stack.backend,
      ...profile.stack.dataMessaging,
      ...profile.stack.delivery,
    ],
  };

  return (
    <>
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://tamtnts.github.io/portfolio/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tamtnts.github.io/portfolio/" />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}og.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <TableOfContents />
      <main>
        <HeroSection />
        <FocusSection />
        <StackSection />
        <ProjectsSection />
        <ExperienceSection />
        <EarlierProjectsSection />
        <EducationSection />
        <ContactSection />
      </main>
    </>
  );
}
