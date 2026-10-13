# 维护手册

给未来的自己看。所有命令都在本机实测过，报错样例也是真跑出来的。

---

## 0. 这里有三套东西

| | 新站（Astro） | 旧博客（Hexo 产物） | 内容后台（Sveltia） |
|---|---|---|---|
| 位置 | `src/` | `public/` 里除 `admin/`、`uploads/` 外 | `public/admin/` |
| 路径 | `/`、`/about/`、`/work/*`、`/blog/*`、`/en/*` | `/archives/`、`/2025/...`、`/wiki/` … | `/admin/` |
| 源码 | Markdown + `.astro`，**在仓库里** | 编译好的 HTML，**源文件已丢失** | 一个静态 HTML + YAML 配置 |
| 怎么改 | 改 Markdown（手改或走后台） | 直接编辑 HTML（痛苦，但可以） | 不用改，它是工具 |
| 能否重新生成 | 能 | **不能** | 不适用 |

> 旧博客是 **2025-08 之前** 的 Hexo 产物，源文件（`_config.yml` / `source/`）已丢失。
> 它现在只是一份只读归档，路径保持原样，别再指望用 Hexo 重新构建。
> 写新文章一律走 §5 / §6。

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
| `http://[::1]:4321/` | ✅ 200 |

**用 `localhost`，别用 `127.0.0.1`。** 需要 IPv4：`npm run dev -- --host 127.0.0.1`。
另外 `npm run dev` 和 `npm run preview` 不能同时跑，都占 4321。

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
| 旧博客的文字 | `public/**/index.html`（直接改 HTML） |

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

只需要建**一种语言**也能正常工作：中文有、英文没有，英文列表里就不会出现它。
标签页同理，各语言各自统计。

写完 `push` 即上线。列表页按年份分组，标签页和 RSS 都是自动的。

> **关于 slug 用中文**：文件名如果是中文，URL 就是 `/blog/中文标题/`。这**能正常工作**
> （浏览器和 GitHub Pages 都会正确处理百分号编码），只是不够好看。
> 想要英文 URL，就在文件建好之后把文件名改成英文，或者用 §6 的后台建（它会先让你确认 slug）。

---

## 6. 内容后台（Sveltia CMS）

地址：**<https://archibald-nice.github.io/admin/>**

它是一个纯静态页面（`public/admin/index.html`），从 CDN 加载 Sveltia CMS，配置在
`public/admin/config.yml`。原理：你用 GitHub 身份登录，它在你的浏览器里拿着令牌直接往仓库
提交 commit，然后照常触发部署。

**没有数据库**，内容始终就是仓库里的 Markdown。谁能写完全由 GitHub 仓库权限决定 ——
没有 Write 权限的账号登不进也提交不了。

### 首次登录：用访问令牌（不需要配 OAuth）

登录页上有两个按钮，**请点「使用访问令牌登录」**。

> ⚠️ 另一个「使用 GitHub 登录」走的是 Netlify 的 OAuth 中转，我们**故意没有配**，
> 点了会失败。这不是故障，是设计如此（个人站不值得为它部署一个 OAuth 服务）。

1. 打开 <https://archibald-nice.github.io/admin/>
2. 点 **「使用访问令牌登录」**
3. 弹窗里会给出一个 GitHub 生成令牌的链接（权限已预选），点过去生成
   - 用 **fine-grained token**：仓库选 `archibald-nice.github.io`，权限给
     **Contents → Read and write**
   - 或用 **classic token**：勾 `repo` 整个 scope
4. 生成后复制，粘回弹窗，登录

### 关于这个令牌

| | |
|---|---|
| 存在哪 | **只在你自己的浏览器 localStorage 里**，不会进仓库，也不会到我的服务器（没有服务器） |
| 权限范围 | 建议 fine-grained + 只授权这一个仓库，最小权限 |
| 失效场景 | 换浏览器、清缓存、隐身模式都要重新登录一次 |
| 撤销 | 随时在 GitHub → Settings → Developer settings 里删掉，删了后台立刻登不上 |
| 注意 | **别在公用电脑上登录**（令牌落在浏览器里） |

### 后台能做什么

- 新建 / 编辑 / 删除中英文文章
- 上传图片（存到 `public/uploads/`，引用路径 `/uploads/xxx`）
- 用「草稿」开关控制是否发布
- 每次保存 = 一次 commit，实测会自动 GPG 签名并标记为 verified

### 后台的字段改了会怎样

`public/admin/config.yml` 里的 `fields` 必须和 `src/content.config.ts` 里的 schema 对得上。
只改一边，编辑器要么看不到字段，要么写出来的 frontmatter 过不了校验。**两边一起改。**

另外配置里这两项是**必须的**，别删：

```yaml
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
- 旧博客的图片在 `public/imgs/`（47MB，多是没压过的壁纸，可以压一遍）。
- 想用 Astro 的自动优化（尺寸/格式），需要放 `src/assets/` 并 `import` 引用，目前没用这套。

---

## 9. 构建失败排查

| 报错关键词 | 原因 | 怎么修 |
|---|---|---|
| `Nested mappings are not allowed in compact mappings` | frontmatter 里某个值含 **ASCII 冒号+空格** 且没加引号 | 用双引号包住整个值，例：`description: "讲三件事: A、B、C"` |
| `Expected type "string", received "number"` | 日期/数字没加引号，YAML 把它当数字了 | `period: '2026'` |
| `does not match collection schema` + `Required` | 必填字段缺了 | 对照 §4 / §5 的字段表补齐 |
| `Invalid url` | `repo` 不是完整 URL | 加 `https://` |
| `Missing about page content for lang=xx` | 删了 `src/content/pages/about-{zh,en}.md` | 补回来 |
| `Could not resolve '@/lib/xxx'` | 路径别名没生效 | 检查 `tsconfig.json` 里的 `paths` |
| `EPERM .../Library/Preferences/astro` | 沙箱拦了遥测写入 | `ASTRO_TELEMETRY_DISABLED=1` |
| `EPERM .../.npm/_cacache` | 沙箱拦了 npm 缓存 | `--cache ./.npm-cache` |

**提交前先跑一次 `npm run build`** —— schema 校验会当场报错，不会带着坏数据上线。

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
`build: failure` + `deploy: skipped`，而线上继续提供上一次成功的版本（首页 200、内容不变）。
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

**已知可用的还原点**：

| commit | 状态 |
|---|---|
| `a6a84a3` | 迁移前的原始 Hexo 博客 |
| `f1f514b` | Astro 新站首次上线 |
| `3379dbe` | Actions 升级到 Node 24 版本 |

---

## 11. 不要做的事

- **别删 `public/.nojekyll`**。退回分支发布模式时，Jekyll 会忽略 `_astro/` 目录，页面直接丢样式。
- **别在 `src/pages/` 下建 `admin.astro`**。必须用 `public/admin/index.html` ——
  Astro 的 dev server 会在保存时重载页面，可能把正在保存的文章写空或留下临时文件。
- **别在 `public/` 根下放 `index.html`**。产物根的 `index.html` 归 Astro 生成，会和它争路径。
- **别删 `public/admin/config.yml` 里的 `output.omit_empty_optional_fields`**，见 §6。
- **别把 `dist/` 提交进仓库**（已在 `.gitignore`）。
- **别改 `astro.config.mjs` 里的 `site`**。写错会让 canonical、hreflang 和 sitemap 里的域名全错。

---

## 12. 已知的内容缺口

旧 Hexo 博客自带 6 条死链（迁移前就有，非新站引入）。要么补内容，要么从 HTML 里删掉链接：

| 死链 | 出现位置 |
|---|---|
| `/notes/java_script` | `notes/`、`wiki/` 等页面的导航 |
| `/notes/java_script.md` | 同上（Hexo 双份链接） |
| `/wiki/archie-life/matters_of_fitness` | `wiki/` 系列 |
| `/wiki/archie-life/matters_of_fitness.md` | 同上 |
| `/bookmark/` | `public/2024/01/01/hello-world/` |
| `/assets/wiki/stellar/photos/hello@1x.png` | `public/2024/01/01/hello-world/` |

其他待办：

- `public/imgs/` 有约 47MB 未压缩图片，可以用 `sips` 批量压一遍。
- 没有买域名，用的是 `archibald-nice.github.io`。买了之后 CNAME 指过来即可，
  也可以顺手把旧博客拆到 `blog.` 子域。
