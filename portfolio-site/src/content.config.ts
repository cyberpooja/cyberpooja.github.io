import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Pooja'),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoDescription: z.string().optional(),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: articleSchema.extend({
    cve: z.string().optional(),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'informational']).optional(),
    affectedSystems: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: articleSchema,
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    repoUrl: z.string().url().optional(),
    downloadUrl: z.string().url().optional(),
    docsUrl: z.string().url().optional(),
    status: z.enum(['active', 'maintenance', 'archived']).default('active'),
    features: z.array(z.string()).default([]),
    screenshots: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { research, blog, tools };
