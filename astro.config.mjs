import { defineConfig } from 'astro/config';
import remakrDirective from 'remark-directive';
import remarkContainerPlugin from './scripts/remark-container-plugin';
import remarkToc from 'remark-toc'
import rehypeToc from '@jsdevtools/rehype-toc'

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remakrDirective, remarkContainerPlugin],
    rehypePlugins: [rehypeToc]
  },
  integrations: [mdx()]
});