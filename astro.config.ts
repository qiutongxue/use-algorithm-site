import { defineConfig } from 'astro/config';
import remakrDirective from 'remark-directive';
import remarkContainerPlugin from './plugins/remark-container-plugin'
import remarkTocPlugin from './plugins/rehype-toc-plugin';

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remakrDirective, remarkContainerPlugin],
    rehypePlugins: [remarkTocPlugin]
  },
  integrations: [mdx()],
});