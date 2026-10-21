# Write in your browser, publish to GitHub Pages

The intended public address is **https://cyberpooja.github.io/**. The source repository is **cyberpooja/cyberpooja.github.io**, with the application files at the repository root (not inside another `mobile-security` folder).

## One-time setup

1. Create `cyberpooja.github.io` in the `cyberpooja` GitHub account. A public repository supports GitHub Pages on GitHub Free. Start with an empty repository.
2. Push this directory's source to its `main` branch. Include `.github/workflows/pages.yml`, `.pages.yml`, and `package-lock.json`; exclude `node_modules`, `.next`, `.next-dev`, `out`, and `.env.local`.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Publish portfolio to GitHub Pages → Run workflow** if the first push ran before Pages was enabled. Wait for the build and deployment to finish. The website will be available at `https://cyberpooja.github.io/`.
5. Visit **https://cyberpooja.github.io/write/** and start writing. Connect a repository-scoped GitHub token in the studio when you are ready to publish. See the Writing Studio guide for the one-time connection.
6. Bookmark `https://cyberpooja.github.io/write/`. Both the editor and public portfolio run on GitHub Pages.

Creating the repository and connecting Pages CMS require access to your GitHub account. Neither is considered complete until actually authorized and verified. Never put a GitHub token or OAuth secret in frontend code or repository files.

## Every time you write

Open **https://cyberpooja.github.io/write/**. The integrated writing studio supports visual editing, code blocks, uploads, local drafts, previews and direct publication to GitHub. Follow [the Writing Studio guide](WRITING-STUDIO.md).

Pages CMS is retained as an optional legacy editor through `.pages.yml`. It is not required to use the integrated studio. Local studio drafts are private to this browser; repository drafts created by an external CMS remain visible in a public GitHub repository.

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
