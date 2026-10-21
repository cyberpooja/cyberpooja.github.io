# Write in your browser, publish to GitHub Pages

The intended public address is **https://cyberpooja.github.io/**. The source repository is **cyberpooja/cyberpooja.github.io**, with the application files at the repository root (not inside another `mobile-security` folder).

## One-time setup

1. Create `cyberpooja.github.io` in the `cyberpooja` GitHub account. A public repository supports GitHub Pages on GitHub Free. Start with an empty repository.
2. Push this directory's source to its `main` branch. Include `.github/workflows/pages.yml`, `.pages.yml`, and `package-lock.json`; exclude `node_modules`, `.next`, `.next-dev`, `out`, and `.env.local`.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Publish portfolio to GitHub Pages → Run workflow** if the first push ran before Pages was enabled. Wait for the build and deployment to finish. The website will be available at `https://cyberpooja.github.io/`.
5. Visit **https://app.pagescms.org/**, sign in with GitHub, and install the Pages CMS GitHub App for **only `cyberpooja.github.io`**. Open that repository and the `main` branch. The included `.pages.yml` automatically supplies the editor configuration.
6. Bookmark `https://cyberpooja.github.io/write/` as your writing entry point. It opens the visual CMS. The editor runs through Pages CMS; the website is hosted by GitHub Pages.

Creating the repository and connecting Pages CMS require access to your GitHub account. Neither is considered complete until actually authorized and verified. Never put a GitHub token or OAuth secret in frontend code or repository files.

## Every time you write

1. Open your website and choose **Write**, or open `/write/` directly. You don't need to complete the emulator challenge to access it.
2. Open the writing studio and select **Blog & Research**.
3. Create a post. Add its title, summary, category, tags, and publication date.
4. Choose **Blog article** or **Research finding**. Research findings appear on both `/blog/` and `/research/`.
5. Write in the visual editor. Add images from the media picker. Use Editor/Source mode to edit Markdown, fenced code blocks, and text diagrams.
6. Leave **Keep as draft** switched on and save while working. Drafts do not appear in routes, search, RSS, sitemap, or the workspace's article list.
7. To publish, switch **Keep as draft** off and save. GitHub Actions builds and deploys the change. The public site updates only after that deployment succeeds; it is not instantaneous.
8. To edit, reopen the post, make changes, and save. To unpublish, enable **Keep as draft** and save.

Pages CMS uses its Save action; this project does not pretend that clicking a button on the public website grants publishing permissions. The public Write link is safe to show: GitHub authentication and repository permissions control who can save.

**Public source and drafts:** A public GitHub repository exposes all committed source files, including drafts and uploaded images. Keep embargoed vulnerabilities, credentials, and private research outside this repository until they can be public. Draft means excluded from the website, not confidential storage.

## What the editor manages

- Title and short SEO summary
- Blog vs research placement
- Publication date, category, and tags
- Optional cover image
- Rich-text body, Markdown source, code blocks, links, and images
- Draft/published flag
- Existing sample MDX articles and new Markdown articles

The optional cover is used by article cards, the article page, and social metadata. URLs come from filenames. Keep a published filename stable to avoid changing its article URL. Dates are labels, not scheduled publication: switching draft off publishes at the next successful build regardless of the date.

New CMS posts use plain `.md` Markdown and are rendered without executing JSX or JavaScript. Existing trusted `.mdx` articles retain MDX support. The content loader is shared by public pages and RSS/sitemap generation to keep draft filtering consistent. Invalid published metadata causes the build to fail while the last successful deployment stays live.

## Repository paths

- `.pages.yml`: visual editor fields and media configuration
- `.github/workflows/pages.yml`: build on pushes to `main`, then deploy `out/`
- `content/posts/`: article and research sources
- `public/uploads/`: uploaded images
- `publishing.json`: publishing target and CMS link
- `app/write/page.tsx`: author entry page
- `lib/content.mjs`: shared content validation and draft filtering

## Optional Git commands

Run these from this project directory after creating the empty GitHub repository. If a `github` remote already exists, inspect it instead of adding another.

```sh
git remote add github https://github.com/cyberpooja/cyberpooja.github.io.git
git push github HEAD:main
```

The repository already contains tracked commits. Ensure the latest changes are committed before pushing. Use your normal GitHub authentication. Do not force-push an existing repository.

## Project repositories and custom domains

The workflow reads the actual Pages base URL and path from GitHub's configure-pages action. It supports a user site, a project URL such as `https://cyberpooja.github.io/portfolio/`, or a custom domain. Internal Next.js links, static assets, uploaded images, canonical URLs, RSS, and sitemap account for this prefix. Set a custom domain in GitHub's Pages settings; configure DNS separately.

## Sources

- https://pagescms.org/docs/quick-start/
- https://pagescms.org/docs/configuration/
- https://pagescms.org/docs/configuration/fields/rich-text/
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
