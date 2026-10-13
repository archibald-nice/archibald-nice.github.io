import rss from '@astrojs/rss';
import { getPosts, slugOf } from '@/lib/posts';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { postPath } from '../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getPosts('zh');

  return rss({
    title: `${SITE.name} (${SITE.latin}) — 博客`,
    description: '记录工程上的取舍、踩过的坑，以及一些还没想清楚的想法。',
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: postPath('zh', slugOf(post)),
    })),
    customData: '<language>zh-CN</language>',
  });
}
