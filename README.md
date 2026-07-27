# Nguyen Thanh Tam Portfolio

English portfolio for Nguyen Thanh Tam, a Java Backend Developer based in Ho Chi Minh City. It presents backend engineering strengths, experience, technical skills, two NDA-safe logistics case studies, education, certifications, and public contact details.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
npm run build
```

The prerender step uses Playwright Chromium. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using an existing local browser executable.

## Content

- Profile and contact data: `src/data/profile.js`
- Featured case studies: `src/data/projects.js`
- Earlier projects: `src/data/earlierProjects.js`

Keep project descriptions NDA-safe. Do not add customer names, sensitive operational data, or unverified performance claims.

## Deployment

Pushes to `main` are verified, built, and deployed to GitHub Pages by `.github/workflows/deploy.yml`.
