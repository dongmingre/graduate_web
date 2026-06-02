# Graduation Photo Wall

A cinematic graduation photo wall built with Vite, React, TypeScript, and GSAP. The page presents optimized photo assets as draggable polaroid cards on a chalkboard-style memory wall.

## Scripts

```sh
npm install
npm run dev
npm run build
```

`npm run build` runs TypeScript checks before producing the Vite production build.

## Deployment

The app is configured for GitHub Pages at:

```text
https://dongmingre.github.io/graduate_web/
```

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy.yml`, build the site, and publish the generated `dist/` artifact to GitHub Pages.
