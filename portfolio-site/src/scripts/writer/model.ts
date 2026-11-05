import { parse, stringify } from 'yaml';
export const REPO = 'cyberpooja/cyberpooja.github.io';
export const ROOT = 'portfolio-site';
export const sections = ['blog', 'research', 'tools'] as const;
export type Section = typeof sections[number];
export interface Story {
  id: string; title: string; content: any; section: Section; description: string;
  category: string; tags: string; repoUrl: string; updated: number;
  path?: string; sha?: string; publishedAt?: string; metadata?: Record<string, any>;
}
export function newStory(): Story {
  return { id: crypto.randomUUID(), title: '', content: { type: 'doc', content: [{ type: 'paragraph' }] }, section: 'blog', description: '', category: 'Web Security', tags: '', repoUrl: '', updated: Date.now() };
}
export function storyPath(story: Story) {
  if (story.path) {
    if (!/^portfolio-site\/src\/content\/(blog|research|tools)\/[a-zA-Z0-9_./-]+\.md$/.test(story.path) || story.path.includes('..')) throw new Error('Invalid story path.');
    return story.path;
  }
  const slug = story.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'story';
  return `${ROOT}/src/content/${story.section}/${slug}-${story.id.slice(0, 8)}.md`;
}
export function serialize(story: Story, markdown: string) {
  if (!story.title.trim() || !markdown.trim()) throw new Error('Add a title and a story before publishing.');
  if (!story.description.trim() || !story.category.trim()) throw new Error('Add a summary and a category.');
  if (story.repoUrl && !/^https?:\/\//i.test(story.repoUrl)) throw new Error('Repository URL must start with https:// or http://.');
  const data = { ...story.metadata, title: story.title.trim(), description: story.description.trim(),
    pubDate: story.metadata?.pubDate ?? story.publishedAt ?? new Date().toISOString(),
    updatedDate: new Date().toISOString(), category: story.category.trim(),
    tags: story.tags.split(',').map(t => t.trim()).filter(Boolean), draft: false,
    ...(story.section === 'tools' && story.repoUrl ? { repoUrl: story.repoUrl } : {}) };
  return `---\n${stringify(data)}---\n\n${markdown}\n`;
}
export function parseStory(text: string) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error('This story has no supported metadata.');
  const metadata = parse(match[1]);
  if (!metadata || typeof metadata !== 'object') throw new Error('Invalid story metadata.');
  return { metadata, markdown: match[2].trim() };
}
export function encode(text: string) {
  return btoa(Array.from(new TextEncoder().encode(text), b => String.fromCharCode(b)).join(''));
}
export function decode(text: string) {
  return new TextDecoder().decode(Uint8Array.from(atob(text.replace(/\s/g, '')), c => c.charCodeAt(0)));
}
