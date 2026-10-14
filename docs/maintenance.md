# 维护手册

给未来的自己看。所有命令都在本机实测过，报错样例也是真跑出来的。

---

## 0. 这里有什么

| | 新站（Astro） | 内容后台（Sveltia） |
|---|---|---|
| 位置 | `src/` | `public/admin/` |
| 路径 | `/`、`/about/`、`/work/*`、`/blog/*`、`/en/*` | `/admin/` |
| 源码 | Markdown + `.astro`，在仓库里 | 一个静态 HTML + YAML 配置 |
| 怎么改 | 改 Markdown（手改或走后台） | 不用改，它是工具 |

`public/` 下只剩部署需要的静态文件：`.nojekyll`、`admin/`、`favicon.png`、`robots.txt`、`uploads/`。

> 以前的 Hexo 博客（2024–2025 那批文章、wiki、笔记）**已经全部删除**，
> 那些 URL 现在都是 404。内容没有真丢，取回方法见 §12。

---

## 1. 环境准备

需要 Node（本机 v24.14.1，建议 22 以上）。

```bash
git clone https://github.com/archibald-nice/archibald-nice.github.io.git
cd archibald-nice.github.io
npm install
```

### 在文件沙箱里跑（DSH / WorkBuddy 这类）

```bash
# ~/.npm 在工作区外会被拒，把 cache 指到工作区内
npm install --cache ./.npm-cache --registry=https://registry.npmmirror.com

# Astro 遥测要写 ~/Library/Preferences/astro，同样会被拒
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

---

## 2. 日常流程

```bash
npm run dev        # 开发服务器，改文件自动刷新
npm run build      # 校验内容格式 + 生成 dist/
git add -A && git commit -m "..." && git push
```

`push` 之后 **1–2 分钟**自动上线（Actions 构建约 15 秒 + Pages 发布）。

### 改内容的三种方式

| 方式 | 适合 | 代价 |
|---|---|---|
| **本地 git** | 大改、要预览效果 | 需要本地环境 |
| **内容后台** `/admin/` | 写文章、手机上改 | 首次要配一次访问令牌，见 §6 |
| **GitHub 网页直接编辑** | 改错别字 | 看不到效果就上线了 |

三种方式最终都是往仓库提交 Markdown，完事后都自动部署。

### 坑：dev / preview 默认只绑 IPv6

实测 `lsof` 是 `TCP [::1]:4321 (LISTEN)`，所以：

| 地址 | 结果 |
|---|---|
| `http://127.0.0.1:4321/` | ❌ 连不上（HTTP 000） |
| `http://localhost:4321/` | ✅ 200 |

**用 `localhost`，别用 `127.0.0.1`。** 要 IPv4：`npm run dev -- --host 127.0.0.1`。
`npm run dev` 和 `npm run preview` 不能同时跑，都占 4321。

### 坑：dev 下后台地址要带 index.html

Astro 的 dev server 对 `public/` 下的目录**不会自动补 `index.html`**，所以本地要看后台得开
`http://localhost:4321/admin/index.html`。线上 `/admin/` 正常。

---

## 3. 改什么 → 改哪个文件

| 想改什么 | 文件 |
|---|---|
| 邮箱、GitHub 链接、后台地址 | `src/consts.ts` |
| 首页自我介绍、slogan、按钮文案 | `src/i18n/ui.ts` → `hero` |
| 首页「我在做什么」的技能分组和标签 | `src/i18n/ui.ts` → `ability` |
| 导航、页脚、博客页文案、404 文案 | `src/i18n/ui.ts` → `nav` / `blog` / `footer` / `notFound` |
| 精选作品 | `src/content/projects/{zh,en}/*.md` |
| 博客文章 | `src/content/posts/{zh,en}/*.md` |
| 关于页长文 | `src/content/pages/about-{zh,en}.md` |
| 「其他项目」和「关注的开源项目」 | `src/data/other.ts` |
| 颜色 / 字号 / 间距 | `src/styles/global.css` 顶部的 `:root` 设计令牌 |
| 页面结构与列表/详情页渲染 | `src/components/*.astro` |
| 路由 | `src/pages/**` |
| 内容后台的表单字段 | `public/admin/config.yml` |
| sitemap / 部署域名 / 集成 | `astro.config.mjs` |

---

## 4. 加一个新的作品

**必须建两个文件**，中英各一份：

```
src/content/projects/zh/my-project.md
src/content/projects/en/my-project.md
```

文件名（去掉 `.md`）就是 URL 的 slug → 生成 `/work/my-project/` 和 `/en/work/my-project/`。

```yaml
---
title: My Project
tagline: 一句话说明它是干什么的
lang: zh                               # 作品的 lang 写在 frontmatter 里
order: 3                               # 首页排序，越小越靠前
period: '2026 — 进行中'                 # 含数字必须加引号，见 §9
role: 独立开发
stack: ['Python', 'FastAPI']
repo: https://github.com/archibald-nice/my-project   # 必须是合法 URL
---
```

正文就是 Markdown，建议结构：**问题 → 做法 → 关键取舍 → 现状**。
详情页、首页列表、sitemap 都自动生成，不用碰路由。

---

## 5. 写一篇新文章

**文件名就是 URL 的 slug**，语言由所在目录决定（**不需要在 frontmatter 里写 `lang`**）：

```
src/content/posts/zh/my-post.md   →  /blog/my-post/
src/content/posts/en/my-post.md   →  /en/blog/my-post/
```

```yaml
---
title: 文章标题
description: "一句话摘要，列表页、RSS 和搜索结果都用它"
date: 2026-10-14
updated: 2026-10-20        # 可选，只有实质修改时才填
tags: ['Astro', '工程']
draft: false              # true 则不出现在列表、RSS 和页面上
---
正文 Markdown
```

只建一种语言也能正常工作：中文有、英文没有，英文列表里就不会出现它。标签页同理，各语言各自统计。

写完 `push` 即上线。列表页按年份分组，标签页和 RSS 都是自动的。

> **关于 slug 用中文**：文件名如果是中文，URL 就是 `/blog/中文标题/`。这**能正常工作**
> （浏览器和 GitHub Pages 都正确处理百分号编码），只是不够好看。
> 想要英文 URL，就在文件建好后把文件名改成英文。

---

## 6. 内容后台（Sveltia CMS）

地址：**<https://archibald-nice.github.io/admin/>**

它是一个纯静态页面（`public/admin/index.html`），从 CDN 加载 Sveltia CMS（版本固定为 0.236.0），
配置在 `public/admin/config.yml`。原理：你用 GitHub 身份登录，它在你的浏览器里拿着令牌直接往
仓库提交 commit，然后照常触发部署。

**没有数据库**，内容始终就是仓库里的 Markdown。谁能写完全由 GitHub 仓库权限决定 ——
没有 Write 权限的账号登不进也提交不了。

### 登录：用访问令牌（不需要配 OAuth）

登录页上只有两项：**「使用本地仓库」和「使用访问令牌登录」**。线上请点后者。

> 本来还有一个「使用 GitHub 登录」，我**已经把它从界面上移除了**
> （配置里的 `auth_methods: [token]`）。原因是那个按钮走 Netlify 的
> `api.netlify.com/auth` 中转，而中转要求站点托管在 Netlify 上 ——
> 本站是 GitHub Pages，点了必然得到 `Not Found`。
> 留一个点了就报错的按钮比没有按钮更糟，所以直接去掉。

**如果以后真想要 GitHub 授权页登录**（多人协作、或不想手动管令牌）：

1. 把 <https://github.com/sveltia/sveltia-cms-auth> 部署到 Cloudflare Workers（有免费额度）
2. 在 GitHub 建一个 OAuth App，回调地址填 Worker 的地址，把 Client ID / Secret 配进 Worker
3. 在 `public/admin/config.yml` 的 backend 里加 `base_url: <你的 Worker 地址>`
4. 把 `auth_methods` 改成 `[oauth, token]` 或 `[oauth]`

1. 打开 <https://archibald-nice.github.io/admin/>
2. 点 **「使用访问令牌登录」**
3. 弹窗里会给出一个 GitHub 生成令牌的链接（权限已预选），点过去生成
   - **fine-grained token**：仓库选 `archibald-nice.github.io`，权限给 **Contents → Read and write**
   - 或 **classic token**：勾 `repo` 整个 scope
4. 生成后复制，粘回弹窗，登录

### 关于这个令牌

| | |
|---|---|
| 存在哪 | **只在你自己的浏览器 localStorage 里**，不会进仓库 |
| 权限范围 | 建议 fine-grained + 只授权这一个仓库 |
| 失效场景 | 换浏览器、清缓存、隐身模式都要重新登录 |
| 撤销 | 随时在 GitHub → Settings → Developer settings 删掉，删了后台立刻登不上 |
| 注意 | **别在公用电脑上登录** |

### 后台能做什么

- 新建 / 编辑 / 删除中英文文章
- 上传图片（存到 `public/uploads/`，引用路径 `/uploads/xxx`）
- 用「草稿」开关控制是否发布
- 每次保存 = 一次 commit，会自动 GPG 签名并标记为 verified

### 改后台字段时注意

`public/admin/config.yml` 里的 `fields` 必须和 `src/content.config.ts` 里的 schema 对得上。
只改一边，编辑器要么看不到字段，要么写出来的 frontmatter 过不了校验。**两边一起改。**

这两项是**必须的**，别删：

```yaml
backend:
  auth_methods: [token]              # 少一个方法会变成配置错误；空数组也会报错
output:
  omit_empty_optional_fields: true   # Zod 的 .optional() 只接受「字段不存在」，
                                     # 而 CMS 默认会写入空字符串/空数组，那会导致构建失败
```

---

## 7. 双语规则

- **中文在根路径**（`/`、`/about/`、`/blog/`），**英文在 `/en/`**。由 `astro.config.mjs` 的
  `i18n.routing.prefixDefaultLocale: false` 控制。
- UI 文案在 `src/i18n/ui.ts` 里按 `zh` / `en` 成对定义。
- **新增页面必须成对**：`src/pages/xxx.astro` + `src/pages/en/xxx.astro`，
  并给 `Base` 传 `altHref`（另一语言的同一页地址）。hreflang 和右上角切换按钮都靠它。
- **标签在两种语言间不是一一对应的**（中文叫「迁移」，英文叫「Migration」）。
  标签页的 `altHref` 只在对面确实存在同名标签时才指过去，否则退回对面的列表页 ——
  否则 hreflang 会指向一个不存在的页面。

---

## 8. 图片

- 图片放 `public/` 下，用根路径引用：`public/me.png` → `<img src="/me.png">`。
- 后台插入的图片会自动进 `public/uploads/`，引用 `/uploads/xxx`。
- 想用 Astro 的自动优化（尺寸/格式），需要放 `src/assets/` 并 `import` 引用，目前没用这套。
- **站点图标**用的是 `~/Pictures/Logo/archie-logo.jpeg`（400×400，深蓝渐变底 + 白色点阵图形）。
  产物是 5 个文件：

  | 文件 | 尺寸 | 用途 |
  |---|---|---|
  | `favicon.ico` | 内嵌 16/32/48 的 PNG | 传统与兜底路径（`/favicon.ico` 隐式请求） |
  | `favicon-16.png` | 16×16 | 浏览器标签页 |
  | `favicon-32.png` | 32×32 | 高分屏标签页、书签 |
  | `favicon.png` | 48×48 | 兜底 |
  | `apple-touch-icon.png` | 180×180 | iOS 加到主屏 |

  引用写在 `src/layouts/Base.astro` 和 `public/admin/index.html`（**两处都要改**）。

  **生成方式**（本机只有 `sips`，没有 Pillow / ImageMagick）：

  - **逐级折半降采样**：400 → 200 → 100 → 50 → 目标尺寸。
    直接 400 → 16 一次到位会明显发糊。
  - **做了紧裁**：原图图形只占画面 **71%**（包围盒 275×284），
    四周留白在 16px 上等于白白浪费像素。紧裁框 = 包围盒 + 12% 余量 = 318×318，
    等效放大 **1.26 倍**，16/32/48 三档都明显更清楚。
    想换回原始构图就重新生成时用完整 0,0,400,400 作为源矩形。
  - `favicon.ico` 是**手工拼的字节**：ICO 头 + 目录项 + 直接内嵌 PNG（Vista 起支持）。
    已用 Chrome 实测能解码（返回 48×48），不是只靠猜格式。

  > **已知限制**：16px 下点阵细节必然全部丢失 —— 图形在 16px 画布里只有约 10px 宽，
  > 装不下几十个点，只能靠品牌蓝 + 图形轮廓辨认。这是原图的细节密度决定的，
  > 不是转换质量问题。真要让 16px 也锐利，需要一个**专门绘制的简化版小尺寸图标**
  > （例如只保留白色剪影、去掉点阵）。

---

## 9. 构建失败排查

| 报错关键词 | 原因 | 怎么修 |
|---|---|---|
| `Nested mappings are not allowed in compact mappings` | frontmatter 某个值含 **ASCII 冒号+空格** 且没加引号 | 用双引号包住整个值，例：`description: "讲三件事: A、B、C"` |
| `Expected type "string", received "number"` | 日期/数字没加引号，YAML 把它当数字了 | `period: '2026'` |
| `does not match collection schema` + `Required` | 必填字段缺了 | 对照 §4 / §5 的字段表补齐 |
| `Invalid url` | `repo` 不是完整 URL | 加 `https://` |
| `Missing about page content for lang=xx` | 删了 `src/content/pages/about-{zh,en}.md` | 补回来 |
| `Could not resolve '@/lib/xxx'` | 路径别名没生效 | 检查 `tsconfig.json` 里的 `paths` |
| `EPERM .../Library/Preferences/astro` | 沙箱拦了遥测写入 | `ASTRO_TELEMETRY_DISABLED=1` |
| `EPERM .../.npm/_cacache` | 沙箱拦了 npm 缓存 | `--cache ./.npm-cache` |

**提交前先跑一次 `npm run build`** —— schema 校验会当场报错，不会带着坏数据上线。

### 坑：sitemap 的 filter 会把新页面一起排掉

`astro.config.mjs` 里的 sitemap `filter` 是**按 URL 正则匹配**的。
之前为了排除旧博客写过 `filter: (page) => !/\/blog\//.test(page)`，
结果后来加的新博客因为它也匹配 `/blog/`，**整块没进 sitemap**，而且不报错、完全静默。

改完 filter 或新增路由后，务必确认一次：

```bash
npm run build
cat dist/sitemap-0.xml | tr '<' '\n' | grep -o 'https://archibald-nice.github.io/[^<"]*' | sort -u
```

---

## 10. 部署与回滚

### 部署

`main` 每次 push 触发 `.github/workflows/deploy.yml`：`npm ci → npm run build → 上传 dist/ → 发布`。

```bash
gh run list --workflow=deploy.yml --limit 5
gh run watch <run-id> --exit-status
gh run view <run-id> --log-failed        # 只看失败的那一步
```

**构建失败不会让站点挂掉。** 这一点实测过：故意删掉一个必填字段推上去，结果是
`build: failure` + `deploy: skipped`，而线上继续提供上一次成功的版本。
所以内容是改不坏线上站的，最坏情况就是白推一次。

### Pages 的关键配置（别乱改）

```bash
gh api repos/archibald-nice/archibald-nice.github.io/pages
```

必须是 `{"build_type": "workflow", "status": "built"}`。
如果变成 `legacy`（Deploy from a branch），Pages 会去直接发布 `main` 的根目录 ——
那里只有 Astro 源码，站点会变成 404。改回来：

```bash
gh api -X PUT repos/archibald-nice/archibald-nice.github.io/pages -f build_type=workflow
```

### 回滚

历史从未被重写（没有 force push），随便回：

```bash
git revert <commit> && git push     # 推荐，保留历史
```

**已知可用的还原点**（hash 截至 `2026-10-14` 的两次重写之后；
重写会让 hash 变化，所以更可靠的做法是按提交信息找：`git log --oneline`）：

| commit | 状态 |
|---|---|
| `460ebb8` | Astro 新站首次上线（现在是历史的根提交，之前的 Hexo 提交已被剪掉） |
| `3018774` | Actions 升级到 Node 24 版本 |
| `c2b1a9f` | 删除全部旧 Hexo 内容，只保留新站 |
| `18c530f` | 当前 tip |

> ⚠️ **2026-10-14 重写过两次历史**（为把旧博客从 `.git` 里彻底清掉，见 §12）。
> 因此**在此之前克隆的每一份本地副本，commit hash 全部与远端不同**，直接 `git pull`
> 会冲突。旧副本要执行一次：
>
> ```bash
> git fetch origin --prune --tags
> git reset --hard origin/main
> ```
>
> 如果本地有未提交的改动，先 `git stash` 或 `git diff > /tmp/wip.patch` 备份再执行。
---

## 11. 不要做的事

- **别删 `public/.nojekyll`**。万一退回分支发布模式，Jekyll 会忽略 `_astro/` 目录，页面直接丢样式。
- **别在 `src/pages/` 下建 `admin.astro`**。必须用 `public/admin/index.html` ——
  Astro 的 dev server 会在保存时重载页面，可能把正在保存的文章写空或留下临时文件。
- **别在 `public/` 根下放 `index.html`**。产物根的 `index.html` 归 Astro 生成，会和它争路径。
- **别删 `public/admin/config.yml` 里的 `output.omit_empty_optional_fields`**，见 §6。
- **别把 `dist/` 提交进仓库**（已在 `.gitignore`）。
- **别改 `astro.config.mjs` 里的 `site`**。写错会让 canonical、hreflang 和 sitemap 里的域名全错。
- **别往 sitemap 的 filter 里加正则**而不验证输出，见 §9。

---

## 12. 旧 Hexo 内容：已彻底移除，**不可恢复**

2026-10-14 先做了**两次历史重写**把旧博客从仓库和 git 历史里清掉，随后**离线归档也按要求删除**。

| 项 | 状态 |
|---|---|
| `public/` 下的旧产物（109 个文件、约 43MB） | 已删除 |
| git 历史里的旧路径（57 条）与 10 个 Hexo 时代提交 | 已重写清除（`--prune-empty`） |
| `hexo-final` 标签 | 已删除 |
| 离线归档 bundle（38MB，含完整旧历史与图片） | **已删除** |
| mirror 备份（38MB） | **已删除** |

重写后的结果（以**从远端重新克隆**验证）：

- 提交数 **21 → 12**，`git log` 从「feat: 个人主页改为 Astro 作品集站」开始
- **历史上出现过的路径数 = 当前站点的路径数 = 51**，历史里只剩现在还在用的文件
- `git log --oneline | grep -c 'Site updated\|First commit'` = **0**
- 克隆体积 **38M → 640K**（`.git` 292K）
- tip 的 tree hash 重写前后完全一致、`git status` 干净、`git fsck` 干净

> ⚠️ **没有任何副本了。** 2024–2025 的旧文章、wiki、笔记和 43MB 图片都已不存在于
> 远端、线上站点、本仓库以及任何归档里。
>
> 万一哪天后悔，只剩两条路：① 搜索引擎或 Web Archive 的旧页面快照
> （`web.archive.org` 搜 `archibald-nice.github.io`）；② 凭记忆重写。
>
> **以后再遇到同类决定，先问一句「要不要留一份离线归档」再动手删。**

### 重写历史时的三个坑（这个留着，下次别再踩）

1. **枚举「历史上所有路径」不要用 `git log --diff-filter=A`。**
   实测它漏了 7 条（101 vs 权威的 108），导致第一次清除不干净、还误以为成功。
   可靠做法是遍历所有提交的树：
   ```bash
   git rev-list --all | while read -r c; do git ls-tree -r --name-only "$c"; done | sort -u
   ```
2. **光删文件不剪空提交，旧时代的提交会留下来。**
   文件删光了但提交还在，`git log` 里仍能看到「Site updated: …」。
   加 `--prune-empty` 才行。
3. **必须验证两个不变量**，否则你不知道重写有没有改坏东西：
   ```bash
   git rev-parse HEAD^{tree}        # 重写前后必须完全一致
   ```
   ```bash
   # 历史里出现过的路径集合，应当等于当前站点的路径集合
   comm -3 <(git rev-list --all | while read -r c; do git ls-tree -r --name-only "$c"; done | sort -u) \
           <(git ls-tree -r --name-only HEAD | sort -u)
   ```

### 本地旧克隆要清干净

重写前克隆过的本地副本，历史里仍带着完整的旧对象（`.git` 里可能还有 38M）。
`git reset --hard` **不够** —— 旧对象还被 reflog 与 remote-tracking ref 引用着：

```bash
git fetch origin --prune --tags
git reset --hard origin/main
git reflog expire --expire=now --all
git gc --prune=now          # ← 少了这步，旧对象还躺在本地
```

**更省事的是直接重克隆**（新克隆只有 640K，不含任何旧对象）：

```bash
rm -rf <旧目录> && git clone https://github.com/archibald-nice/archibald-nice.github.io.git <新目录>
```
