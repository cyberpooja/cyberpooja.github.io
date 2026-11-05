// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';

// GitHub Pages user site.
// This affects sitemap.xml, rss.xml, and canonical/OG tags.
export default defineConfig({
  site: 'https://cyberpooja.github.io',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/writing-help/') && !page.includes('/write/') })],
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
