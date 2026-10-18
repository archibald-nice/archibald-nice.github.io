import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 精选作品。id 形如 `zh/silicon-river`，前缀即语言。
 * 每个文件都会生成一个详情页。
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    lang: z.enum(['zh', 'en']),
    /** 首页排序，越小越前 */
    order: z.number(),
    period: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    repo: z.string().url(),
    /** 线上可访问的地址；没有部署的项目留空 */
    demo: z.string().url().optional(),
  }),
});

/** 单页长文（关于我等），正文用 Markdown 写，便于随时改 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    lede: z.string(),
    lang: z.enum(['zh', 'en']),
  }),
});

/**
 * 博客文章。id 形如 `zh/my-post`：
 *   - 目录名（zh / en）+ 文件名共同决定 id，**语言由目录推导**，不需要 frontmatter 里写 lang
 *   - 文件名就是 URL 的 slug：src/content/posts/zh/my-post.md → /blog/my-post/
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    /** 列表页和 SEO 描述用的一句话摘要 */
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** 草稿不会出现在列表、RSS 和静态页里 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, pages, posts };
