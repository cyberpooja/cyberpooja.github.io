import { withBase } from './paths';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublished<C extends 'research' | 'blog' | 'tools'>(collection: C) {
  const entries = await getCollection(collection, ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function articleHref(collection: 'research' | 'blog', id: string) {
  return withBase(`/${collection}/${id}/`);
}

export function toolHref(id: string) {
  return withBase(`/tools/${id}/`);
}

export function relatedByCategoryOrTags<T extends CollectionEntry<'research'> | CollectionEntry<'blog'>>(
  current: T,
  all: T[],
  limit = 2,
): T[] {
  return all
    .filter((entry) => entry.id !== current.id)
    .map((entry) => {
      const sameCategory = entry.data.category === current.data.category ? 2 : 0;
      const sharedTags = entry.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
      return { entry, score: sameCategory + sharedTags };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}
