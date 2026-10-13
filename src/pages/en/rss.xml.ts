import rss from '@astrojs/rss';
import { getPosts, slugOf } from '@/lib/posts';
import type { APIContext } from 'astro';
import { SITE } from '../../consts';
import { postPath } from '../../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');

  return rss({
    title: `${SITE.latin} (${SITE.name}) — Blog`,
    description:
      'Notes on engineering trade-offs, things I broke along the way, and ideas I have not fully worked out yet.',
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: postPath('en', slugOf(post)),
    })),
    customData: '<language>en</language>',
  });
}
