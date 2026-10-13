import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/**
 * 文章相关的读取逻辑集中在这里。
 * 语言不从 frontmatter 读，而是从目录推导（posts/zh/... → zh），
 * 这样内容后台不需要写入 lang 字段，少一个会静默出错的环节。
 */
export type Post = CollectionEntry<'posts'>;

export function langOf(entry: { id: string }): Lang {
  return entry.id.split('/')[0] as Lang;
}

/** id 是 `zh/my-post`，slug 只取后半段 */
export function slugOf(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

/** 某语言下已发布的文章，按日期倒序 */
export async function getPosts(lang: Lang, options: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    ({ id, data }) => id.startsWith(`${lang}/`) && (options.includeDrafts || !data.draft)
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 按年份分组，年份倒序 */
export function groupByYear(posts: Post[]): Map<number, Post[]> {
  const byYear = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    const bucket = byYear.get(year);
    if (bucket) bucket.push(post);
    else byYear.set(year, [post]);
  }
  return new Map([...byYear.entries()].sort((a, b) => b[0] - a[0]));
}

/** 标签及其文章数，按文章数倒序 */
export function tagCounts(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const name of post.data.tags) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
