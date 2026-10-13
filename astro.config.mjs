// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://archibald-nice.github.io',

  // 中文在根路径，英文在 /en/
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en-US' } },
      // 旧的 Hexo 静态博客（public/ 下）不进 sitemap，避免和新站内容互相稀释权重
      filter: (page) => !/\/blog\//.test(page),
    }),
  ],

  build: { inlineStylesheets: 'auto' },
});
