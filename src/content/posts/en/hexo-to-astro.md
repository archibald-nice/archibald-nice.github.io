---
title: Moving this blog from Hexo to Astro
description: "The old blog only left behind compiled HTML — the source was gone. The migration had to do three things at once: let the new site take the root path, break zero old links, and stay reversible."
date: 2026-10-14
tags: ['Astro', 'Hexo', 'Static site', 'Migration']
draft: false
---

This site used to be a Hexo blog with the Stellar theme. The problem was never that it was bad — it was that it could only be a blog. The homepage was a list of posts, and there was nowhere to say *who I am and what I have built*.

I wanted the root path to become a portfolio, without losing anything I had written before.

## The real constraint: there is only one root

On GitHub Pages an account has exactly one "root" — the `<username>.github.io` repository. Whoever occupies it is the front door.

So there were three options:

1. Buy a domain and push the blog to a `blog.` subdomain — cleanest, but costs money and needs DNS work
2. Let the new site take the root and move the old blog wholesale — free, but old links could break
3. Create a separate repository at `/me/` — safest, but the front-door URL is wasted

I picked the second. The whole question was: **would the old links break?**

## The key finding: Hexo's output is entirely absolute paths

Before touching anything I checked what the old output's links looked like. All of them were root-absolute:

```html
<link rel="stylesheet" href="/css/main.css">
<a href="/2025/08/17/how-to-become-fullstacker/">
<a href="/wiki/coding-study/">
```

That means as long as **every file keeps its exact path**, no internal link needs editing. So I did not rewrite a single line of HTML — I shifted the entire directory tree under `public/`, because Astro copies `public/` verbatim into the output root.

The only special case was the old `index.html`: the new homepage claims that path. Its content already exists at `/archives/`, so I deleted it — and its contents are still sitting in git history.

## `git mv`, not a force push

The migration used `git mv` rather than "delete the old, commit the new":

```
111 files renamed   (git recognised every file as a rename, not delete + add)
```

That buys two things. The diff stays readable — a reviewer can see that a file merely moved. And history stays continuous: any file still traces back to its commits from the Hexo era.

I also did not force push. The new site is an ordinary follow-up commit; the original ten commits remain intact on `main`, and rolling back is a `git reset --hard` away.

## How I confirmed zero broken links

"I think nothing broke" does not count. You need a baseline to compare against. So I exported the pre-migration repository to a temp directory with `git archive`, then ran the *same* internal-link checker against both the **before** and **after** trees — parse every HTML file, pull out root-absolute links, map each back onto the filesystem and see whether it exists.

Results:

| | Before | After |
|---|---|---|
| HTML files | 31 | 41 |
| Internal links | 948 | 1027 |
| Broken (deduplicated) | 5 | 5 |
| Newly broken | — | **0** |

Those five existed in both versions, which proves they were pre-existing dead links rather than migration damage. That before/after comparison matters far more than the after number alone — otherwise, seeing five broken links, you have no way to tell whose fault they are.

## Two old defects fixed along the way

The check surfaced two pre-existing problems.

**Email links missing `mailto:`** — present on 30 pages, written as `href="/archibaldwan@163.com"`. The Hexo config treated the address as a bare string, so clicking it just navigated to a path that does not exist.

**Windows backslashes in image paths on 7 pages:**

```html
<img data-src="\imgs\backup-2023\wallpaper-coder.png">
```

Windows path separators had leaked into the config. The interesting part: it **never actually broke the images**, because browsers normalise `\` to `/` when parsing URLs. I changed them to forward slashes, but that is code hygiene, not a production bug.

And a confession: while checking whether those images existed, I ran `replace('\\', '/')` on the paths. The leading backslash turned them into absolute filesystem paths, `/imgs/...` obviously did not exist, and I concluded "those images are missing, the live site is broken". I only corrected it by checking the real URLs. **Your checking script has bugs too — and the wrong conclusion it hands you looks exactly as credible as the right one.**

## The structure at the time of the migration

```
src/                    new site (Astro)
  content/projects/     portfolio
  content/posts/        blog posts
  content/pages/        about page
public/                 old blog output, paths preserved exactly
  archives/ 2025/ wiki/ ...
  .nojekyll             stops Jekyll from eating the _astro/ directory
```

Deployment runs through GitHub Actions: every push to `main` builds and publishes to Pages. The original ten commits are still there — `a6a84a3` is the complete old blog.

## One takeaway

The biggest risk in migration work is not "I can't change it" — it is **not being able to say which breakage was already there**. Building the baseline before touching anything is far cheaper than explaining afterwards. Without that before/after data, those five broken links would have cost me an afternoon.

## Afterword: I retired the old content after all

Once the "preserve every old path" approach above was working, I made another decision: **stop keeping any of the old blog.**

The reason was that the cost never went away and the benefit was zero. 43MB of wallpapers and old theme assets sat in the repository slowing down every clone; the old pages only rendered properly with jsdelivr's CDN, and a CDN hiccup produced a wall of broken images; and it still carried six dead links that were never fixed — `/notes/java_script`, `/wiki/archie-life/matters_of_fitness`, `/bookmark/` and friends, all pointing at pages that stopped existing back in the Hexo era.

So I removed every Hexo artefact under `public/` — 109 files — keeping exactly one, `favicon.png`, because the new site's `<link rel="icon">` still points at it.

**The cost, stated plainly**: these URLs now all return 404.

- `/2024/01/01/hello-world/`
- `/2025/07/30/common-ai-words/`
- `/2025/08/17/how-to-become-fullstacker/`
- `/archives/`, `/categories/`, `/tags/`, `/wiki/`, `/notes/`, `/notebooks/`, `/more/`

If search engines indexed them, or anyone linked to them, those links are broken now. I judged that acceptable: those pages were early study notes, not things I want people to find.

**Nothing was actually lost.** Before deleting, I tagged the last commit containing the full Hexo content as `hexo-final` and pushed it, so it is one command away:

```bash
git fetch --tags
git show hexo-final:public/2025/08/17/how-to-become-fullstacker/index.html
git checkout hexo-final -- public/2025
```

That is probably the most valuable lesson here: **make a destructive change recoverable before you make it** — far cheaper than explaining afterwards.
