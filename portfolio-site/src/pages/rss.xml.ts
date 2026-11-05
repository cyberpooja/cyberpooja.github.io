import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, articleHref } from '../utils/content';
import { SITE } from '../site.config';

export async function GET(context: APIContext) {
  const research = await getPublished('research');
  const blog = await getPublished('blog');

  const items = [...research.map((e) => ({ e, collection: 'research' as const })), ...blog.map((e) => ({ e, collection: 'blog' as const }))]
    .sort((a, b) => b.e.data.pubDate.valueOf() - a.e.data.pubDate.valueOf());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: items.map(({ e, collection }) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.pubDate,
      link: articleHref(collection, e.id),
      categories: [e.data.category, ...e.data.tags],
    })),
  });
}
