# Focused writing workspace

Open `/write/` to write immediately. The custom Tiptap editor provides a title and story canvas, floating selection formatting, inline insert menu, image paste/drop, and preview. Metadata appears only in the publish dialog.

## Drafts

Drafts are saved to IndexedDB on the current browser. The editor shows save success/failure and supports multiple stories and JSON backup export/import. Backups restore as a new draft so they cannot overwrite an existing published entry. Local drafts are not sent to GitHub. Clearing browser storage removes them; download backups for portability.

## Publishing

Connect with a fine-grained GitHub token scoped to `cyberpooja/cyberpooja.github.io` and **Contents: read/write**. Tokens are kept in memory only and are not saved with drafts, in localStorage, or in the repository. Reloading the page requires reconnecting to publish, but writing does not require signing in.

Publishing writes a Markdown file to `portfolio-site/src/content/{blog,research,tools}`. Embedded PNG/JPEG/WebP/GIF images up to 5 MB are uploaded to `portfolio-site/public/uploads` first. If publishing fails, the local draft remains intact; an image already uploaded may remain in the repository. GitHub Pages deploys after the commit. The editor distinguishes a successful commit from a completed deployment.

Published entries can be reopened from My stories → Published. Existing frontmatter is preserved, and GitHub's file SHA prevents accidentally overwriting a newer remote edit. On conflict, download the local draft before reloading the published version.

The previous Sveltia configuration is retained for existing workflow data; it is no longer the `/write/` experience. Existing editorial drafts on GitHub branches are not automatically migrated into local drafts.

## Checks

Run `npm test`, `npm run astro -- check`, and `npm run build`. Tests cover metadata round-trips, published update conflicts, image validation, editor serialization, and IndexedDB persistence without creating repository content.
