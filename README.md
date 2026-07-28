# Nguyen Thanh Tam Portfolio

Public portfolio for Nguyen Thanh Tam, Java Backend Developer. Built with React, Vite, and Tailwind CSS.

## Local verification

```powershell
npm test
npm run lint
$env:VITE_BASE='/portfolio/'
npm run build
```

After the build, clear the local base-path override with `Remove-Item Env:VITE_BASE`.

## Deployment

Changes pushed to `main` are verified, built, and deployed to GitHub Pages by `.github/workflows/deploy.yml`.
