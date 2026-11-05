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

Open https://cyberpooja.github.io/write/ to start writing immediately.

The focused editor offers a title and story canvas, selection formatting, an insert menu, image paste/drop, preview, and automatic local draft saving. My stories lists browser drafts and can load published entries after GitHub sign-in. Download draft backups from the more menu to keep copies outside this browser.

Publishing opens a separate dialog for the section, summary, category, and tags. Connect a GitHub token with Contents read/write access to this repository when ready to publish. Tokens stay in memory only. Publishing commits Markdown and images and starts GitHub Pages deployment.

See https://cyberpooja.github.io/writing-help/ for instructions, or `portfolio-site/CMS-SETUP.md` for implementation details.

Run `npm test`, `npm run astro -- check`, and `npm run build` from `portfolio-site/` to validate changes.
