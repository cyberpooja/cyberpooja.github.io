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

## Writing and publishing

Select **Write** on the website or open https://cyberpooja.github.io/write/.
The visual editor supports blog posts, research articles, and tools/projects with rich text, images, preview, saved drafts, and publishing.

For first-time sign-in, follow https://cyberpooja.github.io/writing-help/.
Use a fine-grained GitHub token scoped to this repository with Contents and Pull requests read/write access. Enter it only in the editor, never in repository files.

Drafts are saved on workflow branches and are not deployed until published. This repository is public, so saved drafts are not confidential. Publishing merges the entry to main and triggers Pages automatically.

For the technical configuration, see `portfolio-site/CMS-SETUP.md`.
