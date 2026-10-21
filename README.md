# Browser writing and publishing

The portfolio now has an integrated rich-text editor at **`/write/`**: titles/subtitles, selection formatting, headings, lists, tables, highlighted code blocks, image uploads, local autosaved drafts, preview, story management and GitHub publishing. The normal writing flow stays on your website.

See [the writing studio guide](docs/WRITING-STUDIO.md) for daily use, private draft backups and connecting a GitHub publishing token. See [GitHub hosting](docs/GITHUB-PUBLISHING.md) for the public site deployment.

# Puja / Mobile Security

A Next.js + TypeScript portfolio with a simulated Android/Frida entrance and a static, MDX-powered technical publication. The phone uses CSS 3D transforms and pointer-responsive rotation to keep startup light and the UI accessible without a WebGL dependency.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm test`, `npm run build`, and `npm run check` for verification. `npm run build` exports the deployable website to `out/`. Because this uses static export, serve `out/` with a static host using `npx serve out` (also available as `npm start`).

## Structure

- `app/`: homepage, portfolio, research, projects, speaking, contact and blog routes
- `components/Challenge.tsx`: deterministic two-stage simulated challenge
- `lib/challenge.mjs`: command parser, independently tested
- `components/BlogList.tsx`: client-side title, summary, tag search and filters
- `content/posts/`: trusted Markdown/MDX articles
- `lib/posts.ts`: build-time content loading
- `lib/site.ts`: identity and contact configuration
- `scripts/feeds.mjs`: RSS, sitemap and robots generation
- `public/`: images and downloadable resume

## Publishing without editing frontend code

```sh
npm run post:new -- my-research-note
```

Edit the generated `content/posts/my-research-note.mdx`, including its title, description, quoted ISO date, category and tags. Set `draft: false`, then rebuild and deploy. Edit existing MDX files to update articles; remove files to unpublish them. Drafts are excluded from routes, feeds and search. The filename is the permanent URL slug: changing it changes the URL. Manual file editing remains optional; the configured Pages CMS provides browser-based editing through GitHub.

MDX supports Markdown, fenced code blocks with syntax highlighting, GFM tables, JSX, images (`![Description](/image.png)`) and code-block text diagrams. Put image files in `public/`. Only compile trusted author content: MDX is executable at build time. Rich SVG diagrams can be included as authored JSX; automatic Mermaid rendering is not bundled.

## Challenge

1. `frida -U -f com.lab.vault -l root-bypass.js`
2. `frida -U -f com.lab.vault -l ssl-bypass.js`

Flags may be reordered. Unknown flags, incorrect targets, wrong-stage scripts and appended shell instructions are rejected. The emulator displays a typewritten security alert (with skip and reduced-motion support). Hints can be copied or inserted. Built-in commands: `help`, `status`, `history`, and `clear`. Up/Down recall submitted commands and preserve the current draft. Timed Frida and logcat-style output reports each hook; inputs lock during attachment to prevent duplicate transitions. Success shows an Access Granted animation, marks the browser session complete, and transitions to `/portfolio/`. The entrance displays only the emulator: there are no navigation, skip, footer, or writing links. Existing content routes remain directly accessible for SEO; the homepage continues to show the challenge. Nothing executes on a real device. `/portfolio/`, `/about/`, and all existing content routes stay directly accessible for readers and indexing. The completed session survives reloads in the same tab (sessionStorage); a new tab normally starts locked. Reloading the entrance resets the lab display. This is a UI simulation, not real authentication, and does not protect confidential content.

## Personalize before public launch

Replace sample biography, project proposals and talk outlines with verified details. Configure email and GitHub/LinkedIn URLs in `lib/site.ts`. Replace `public/resume.txt` with a real resume and update the link. The current articles are explicitly sample educational posts. No unverifiable career credentials are presented as fact.

## Deployment

Set `NEXT_PUBLIC_SITE_URL=https://your-domain.example` before building so article canonical URLs, structured data, RSS and sitemap use your actual public origin.

```sh
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

Upload **all of `out/`** to any static host (Nginx, Cloudflare Pages, Netlify, or equivalent). Configure directory index resolution (`/blog/slug/` → `/blog/slug/index.html`), a custom 404 page, HTTPS and caching. On Vercel import this directory, use the Next.js framework/build, and configure the same environment variable. No database or secrets are required.

Sites deployment uses `.openai/hosting.json`. A private Sites preview requires authentication and cannot be indexed publicly. Public indexing requires a public hosting deployment; the application itself never gates articles. Google Fonts is optional: the CSS includes system fallbacks. Test real devices, keyboard navigation, and your final authored content before launch.

## Android tablet About workspace

`/portfolio/` is the existing post-challenge About destination; `/about/` is an alias with a canonical URL pointing to `/portfolio/`. The workspace replaces only this page’s presentation. Existing Writing, Research, Projects and Speaking routes remain unchanged and directly accessible.

App icons open keyboard-accessible native dialog windows. Back restores the previous window; Home and Close clear the app stack. Escape dismisses the window and restores launcher focus. Writing, Research, Projects and Speaking windows include links to their full routes. Research/project/speaking data is shared with the existing pages through `lib/portfolio-content.ts`; writing previews come from the same MDX source.

The security widget reads the completed challenge session. Direct visitors see “Not run” rather than a fabricated bypass. Toolkit entries describe an illustrative research workflow; career dates and confirmed speaking appearances remain unprovided. No employment, awards, or conference credits were invented.

The generated mountain wallpaper is a 98 KB WebP asset. CSS provides bezels, reflections, shadows and pointer tilt (maximum 1 degree), with no WebGL dependency. Tilt uses requestAnimationFrame, is disabled on touch and for reduced motion, and pauses while an app window is open. The Fun Stuff window offers two local wallpaper moods. The dock uses internal navigation until personal profile URLs are configured.
