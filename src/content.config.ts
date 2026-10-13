import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 精选作品。id 形如 `zh/silicon-river`，前缀即语言。
 * 每个文件都会生成一个详情页；只做一句话说明的次要项目见 src/data/other.ts。
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

export const collections = { projects, pages };
