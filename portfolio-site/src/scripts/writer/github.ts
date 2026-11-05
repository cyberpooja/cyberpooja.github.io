import { REPO, ROOT, encode, decode, storyPath, serialize, type Story } from './model';
export class GitHub {
  constructor(private token: string, private request: typeof fetch = fetch) {}
  async api(path: string, method = 'GET', body?: unknown): Promise<any> {
    const response = await this.request(`https://api.github.com${path}`, { method,
      headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}) });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Your sign-in expired. Connect GitHub again.');
      if (response.status === 409 || response.status === 422) throw new Error('The repository changed. Your draft is safe. Reload the published story before retrying.');
      if (response.status === 403) throw new Error('GitHub refused access. Check Contents read/write permission, token expiry, and API limits.');
      if (response.status === 404) throw new Error('Repository or story not found. Check access to cyberpooja.github.io.');
      throw new Error(`GitHub could not complete the request (${response.status}). Your draft is safe.`);
    }
    return response.json();
  }
  async connect() {
    const repo = await this.api(`/repos/${REPO}`);
    if (!repo.permissions?.push) throw new Error('This account does not have permission to publish to this site.');
    const user = await this.api('/user');
    return user.login as string;
  }
  async list() {
    const results = await Promise.all(['blog','research','tools'].map(async section => {
      const files = await this.api(`/repos/${REPO}/contents/${ROOT}/src/content/${section}?ref=main`);
      return files.filter((f: any) => f.type === 'file' && f.name.endsWith('.md')).map((f: any) => ({...f, section}));
    }));
    return results.flat();
  }
  async read(path: string) {
    const file = await this.api(`/repos/${REPO}/contents/${path}?ref=main`);
    return { text: decode(file.content), sha: file.sha };
  }
  async publish(story: Story, markdown: string) {
    const path = storyPath(story);
    const content = serialize(story, markdown);
    const result = await this.api(`/repos/${REPO}/contents/${path}`, 'PUT', {
      message: `${story.sha ? 'Update' : 'Publish'} ${story.section}: ${story.title.trim()}`,
      branch: 'main', content: encode(content), ...(story.sha ? { sha: story.sha } : {})
    });
    return { path, sha: result.content.sha, commit: result.commit.sha };
  }
  async image(dataURL: string) {
    const match = dataURL.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/);
    if (!match || match[2].length > 7_000_000) throw new Error('Use a PNG, JPEG, WebP, or GIF image under 5 MB.');
    const name = `${crypto.randomUUID()}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
    await this.api(`/repos/${REPO}/contents/${ROOT}/public/uploads/${name}`, 'PUT', {
      message: 'Upload story image', branch: 'main', content: match[2]
    });
    return `/uploads/${name}`;
  }
}
