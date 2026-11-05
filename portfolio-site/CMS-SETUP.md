# Writing from the browser

Open https://cyberpooja.github.io/write/ or select **Write** in the website header.

## Sign in

Choose **Sign In with Token**. Create a GitHub fine-grained token for only `cyberpooja/cyberpooja.github.io`, with **Contents: Read and write** and **Pull requests: Read and write**, then enter it in the editor. Never commit or share the token. Sign out on shared computers. The editor stores your sign-in in this browser; renew it when the token expires.

## Write and publish

1. Select Blog, Security Research, or Tools & Projects and create a new entry.
2. Enter your title, summary, and story. Use the visual toolbar for headings, bold, lists, quotes, code, links, and images. No Markdown is required.
3. Use Preview to review your entry. Save it as a draft until ready.
4. Use the editorial workflow to mark it ready and Publish. Publishing updates the website automatically; allow the Pages build to finish.

Saved drafts are kept on separate GitHub branches until published. They do not appear on the website, but this is a public repository, so saved drafts are not confidential.

The `draft` frontmatter value defaults to false because publication is controlled by the editorial workflow. There is no second draft switch to forget.

The backend is connected directly to the existing repository. OAuth is not configured; token sign-in works without an OAuth server. The editor is pinned to Sveltia CMS 0.260.0 with a verified integrity hash. Content is saved as Markdown and media is stored under `portfolio-site/public/uploads`.
