# Your writing studio

Open **https://cyberpooja.github.io/write/**, or choose **Write a blog** in the tablet workspace. The editor is part of the portfolio. Pages CMS is no longer required for the normal writing flow.

## Write

Start typing the title, optional subtitle, and body. Select text to show the floating formatting menu, or use the toolbar. Keyboard shortcuts such as Ctrl/Cmd+B, Ctrl/Cmd+I, and undo/redo work in the story body.

Use the **+** button for blocks. You can also type `/code`, `/heading`, `/quote`, `/image`, `/list`, `/checklist`, `/table`, or `/divider` in a blank paragraph and press Enter. Code blocks have a language selector and syntax highlighting. Paste source code into the block as plain text. Use Arrow Down at the end or Ctrl/Cmd+Enter to exit a code block.

Images can be uploaded, pasted from the clipboard, dropped into the body, or added from a URL. Supported uploads: PNG, JPEG, WebP, GIF, up to 5 MB each. Add image descriptions for accessibility. The editor keeps uploaded images with the local draft until publication. Cover images are optional.

**Preview** shows a reader view without the editing controls. **Paper/Dark theme** changes the studio appearance. Words and estimated reading time appear at the bottom.

## Drafts and backups

Drafts autosave to this browser's IndexedDB after a short typing pause. They do not get pushed to the public repository just by writing or saving. **Your stories → On this device** opens saved drafts. **New story** starts another draft.

Local drafts do not sync between devices. They can be lost if browser data is cleared, storage is denied, or the device is lost. Use **Export backup** to download a `.studio.json` file, including locally uploaded images. Import it using **Your stories → Import backup**. Do not share a backup if it contains private research.

The editor reports storage failures and asks you to export a backup. Ctrl/Cmd+S explicitly saves the current draft. An unfinished save is also checked when leaving the page.

## Connect publishing once per tab

GitHub Pages is a static host. The browser editor publishes directly to the GitHub API using a user-provided token; there is no embedded application secret and no separate server to maintain.

1. Open the **GitHub icon** in the studio, or choose Publish and connect when prompted.
2. Follow **Create a publishing token on GitHub**.
3. Select resource owner `cyberpooja`, restrict access to **only `cyberpooja.github.io`**, and set **Repository permissions → Contents → Read and write**. Choose an expiry you are comfortable with.
4. Create the token on GitHub and paste it into the studio's Account panel. Do not paste it into chat or commit it to the repository.
5. Connect. Your token is sent only to `https://api.github.com` and stays in React memory for that tab. It is not included in IndexedDB, localStorage, exports, or publication files. Refreshing or closing the tab requires reconnecting before the next publication. Writing and local autosave do not require a token.

The token must have access to this repository. Branch protection can still block a direct publish. Revoking or expiring the token disables future writes without affecting local drafts. There is a Disconnect control.

## Publish

1. Choose **Publish** in the top bar.
2. Add a short search summary, category, comma-separated topics, and publication date. Choose **Blog article** or **Research finding**.
3. Review the generated URL. A title-based URL can be edited before the first publication; it stays fixed when updating an existing article.
4. Choose **Publish story**. This creates a Git commit containing the Markdown post and referenced uploaded images together. GitHub Actions then builds and deploys the website.
5. The studio reports that the commit was sent; it does not pretend the deployment is instant. Open the story after the GitHub Actions deployment completes.

The publication date is a label, not a scheduler. Published research appears in both the blog and Research page. All posts receive canonical metadata and enter RSS, sitemap, search, and the workspace lists. Local drafts stay out of these public outputs.

## Edit or unpublish

Choose **Your stories → On GitHub** and open a story. Change its content and **Publish changes**. Existing article URLs remain stable. A local copy is also saved for continued writing. Custom JSX/import-based MDX stories are protected from visual editing to avoid dropping unsupported components; edit those directly in GitHub. Plain Markdown and the provided sample articles work in the studio.

**Unpublish** marks the source as a repository draft. The article disappears from public routes and feeds after deployment, but the source remains in the public GitHub repository and history. Unpublishing does not make previously published information confidential.

## Implementation and verification

- Tiptap 3 provides the visual editor, block schema, editing history, Markdown serialization, and lowlight code highlighting.
- Drafts and images are stored in IndexedDB. The token lives only in component memory.
- The publisher validates article/upload paths, checks the existing file SHA, creates a Git tree and commit, then advances `main` with `force: false`. Stale content or branch races stop rather than overwrite newer work.
- New posts render as Markdown without executing JSX or JavaScript. Existing trusted MDX support stays available.
- Tests cover editor Markdown round-trips, literal code, images, undo, publishing metadata, upload batching, duplicate slugs, stale edits, and non-forced branch updates. Browser visual QA still requires an available browser.

Sources: https://tiptap.dev/docs/editor/markdown/getting-started/basic-usage and https://docs.github.com/en/rest/git
