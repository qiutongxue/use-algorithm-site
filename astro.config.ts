import { defineConfig } from 'astro/config'
import remakrDirective from 'remark-directive'
// import remarkTocPlugin from './plugins/rehype-toc-plugin';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
// https://astro.build/config
import mdx from '@astrojs/mdx'
import remarkContainerPlugin from './plugins/remark-container-plugin'

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remakrDirective, remarkContainerPlugin, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [mdx()],
})
