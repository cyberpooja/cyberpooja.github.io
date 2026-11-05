# Pooja’s security research site

Published at https://cyberpooja.github.io/.

The active Astro project is in `portfolio-site/`. GitHub Pages builds and deploys only this project when changes are pushed to `main`. The previous application is no longer published.

## Local development

Use Node.js 24, then run:

```sh
cd portfolio-site
npm ci
npm run dev -- --background
```

## Adding content

Add Markdown or MDX files to `portfolio-site/src/content/research/`, `portfolio-site/src/content/blog/`, or `portfolio-site/src/content/tools/`. These collections start empty. Set `draft: false` when ready to publish.

Run `npm run build` inside `portfolio-site/` to check the production build and regenerate search.
