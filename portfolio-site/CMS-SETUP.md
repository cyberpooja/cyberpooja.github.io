# Publishing workflow setup (do this when you're ready to host)

This site's writing/publishing experience is powered by **Sveltia CMS**
(`public/admin/index.html` + `public/admin/config.yml`), a browser-based editor that commits
directly to this GitHub repo — no local Markdown editing or `git` commands
needed once this is wired up.

It isn't wired up yet. Three things need to happen first, all one-time setup:

1. **Push this repo to GitHub** under your personal account, as a new project
   repo (not `username.github.io`, since that name is already taken by
   another project of yours).
2. **Create a GitHub OAuth App** (Settings → Developer settings → OAuth Apps)
   pointing its callback URL at your OAuth worker (step 3).
3. **Deploy a small OAuth broker.** GitHub OAuth requires a client secret,
   which can never live in frontend code — so Sveltia (like every Git-based
   CMS) needs a tiny backend to do the token exchange. The standard,
   free option is a ~10-line Cloudflare Worker. I can write and walk you
   through deploying this worker when you're ready for the hosting phase.

Once those three exist, update `public/admin/config.yml`:
- `backend.repo` → `your-username/your-repo`
- `backend.base_url` → your deployed worker's URL

Until then, you can still preview the editor UI locally without any GitHub
auth at all — Sveltia CMS has its own built-in local mode, no proxy server
needed:

```bash
npm run dev
# visit /admin/, click "Work with Local Repository" on the login screen,
# and select this project's folder when your browser prompts you.
# Writes go straight to your local working copy on disk, not GitHub.
```

(This uses the File System Access API, so it needs a Chromium-based browser —
Chrome, Edge, Brave, etc. — not Firefox or Safari.)

This local mode is enough to try out the writing experience (WYSIWYG editing,
image paste/drop, drafts) before any hosting decisions are finalized.
