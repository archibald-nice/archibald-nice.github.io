/**
 * 站点级常量。改这里就能改全站的联系方式和品牌信息。
 */
export const SITE = {
  name: '大梁',
  latin: 'Archibald',
  email: 'archibaldwan@163.com',
  github: 'https://github.com/archibald-nice',

  /** 新博客（Astro 内容集合，写在 src/content/posts/） */
  blog: '/blog/',
  /** 旧 Hexo 博客的内容归档，路径保持原样 */
  legacyArchive: '/archives/',
  /** 内容后台（Sveltia CMS，GitHub 账号或 token 登录） */
  admin: '/admin/',

  url: 'https://archibald-nice.github.io',
} as const;
