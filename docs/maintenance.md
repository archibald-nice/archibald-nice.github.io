# 维护手册

给未来的自己看。所有命令都在本机实测过，报错样例也是真跑出来的。

---

## 0. 先分清两件完全不同的事

这个仓库里现在有**两套东西**，维护方式完全不同：

| | 新站（Astro） | 旧博客（Hexo 产物） |
|---|---|---|
| 位置 | `src/` | `public/` |
| 路径 | `/`、`/about/`、`/work/*`、`/en/*` | `/blog/`、`/archives/`、`/2025/...`、`/wiki/` … |
| 源码 | Markdown + `.astro`，**在仓库里** | 编译好的 HTML，**源文件已丢失** |
| 怎么改 | 改 Markdown，重新构建 | 直接编辑 HTML（痛苦，但可以） |
| 能不能重新生成 | 能，`npm run build` | **不能**，没有 Hexo 源文件了 |

> ⚠️ **重要**：目前**没有「写新博客文章」的能力**。Astro 站只有作品集、关于页、项目详情页。
> 想写新文章，需要先给 Astro 加一个 posts 内容集合，见 §7。

---

## 1. 环境准备

需要 Node（开发机上是 v24.14.1，建议 22 以上）。

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

## 2. 日常工作流

```bash
npm run dev        # 开发服务器，改文件自动刷新
npm run build      # 校验内容格式 + 生成 dist/
git add -A && git commit -m "..." && git push
```

`push` 之后 **1–2 分钟**自动上线（Actions 构建约 45 秒 + Pages 发布）。

### 坑：dev / preview 默认只绑 IPv6

实测 `lsof` 结果：

```
node  32462 archie  16u  IPv6  TCP [::1]:4321 (LISTEN)
```

| 地址 | 结果 |
|---|---|
| `http://127.0.0.1:4321/` | ❌ 连不上（HTTP 000） |
| `http://localhost:4321/` | ✅ 200 |
| `http://[::1]:4321/` | ✅ 200 |

**用 `localhost`，别用 `127.0.0.1`。** 需要 IPv4 时：

```bash
npm run dev -- --host 127.0.0.1
```

另外 `npm run dev` 和 `npm run preview` **不能同时跑**，都占 4321。

---

## 3. 改什么 → 改哪个文件

| 想改什么 | 文件 |
|---|---|
| 邮箱、GitHub 链接、博客地址 | `src/consts.ts` |
| 首页自我介绍、slogan、按钮文案 | `src/i18n/ui.ts` → `hero` |
| 首页「我在做什么」的技能分组和标签 | `src/i18n/ui.ts` → `ability` |
| 导航文字、页脚文案、404 文案 | `src/i18n/ui.ts` |
| 精选作品 | `src/content/projects/{zh,en}/*.md` |
| 关于页长文 | `src/content/pages/about-{zh,en}.md` |
| 「其他项目」和「关注的开源项目」 | `src/data/other.ts` |
| 颜色 / 字号 / 间距 | `src/styles/global.css` 顶部的 `:root` 设计令牌 |
| 页面结构（HTML） | `src/components/*.astro`、`src/pages/*.astro` |
| 旧博客的文字 | `public/**/index.html`（直接改 HTML） |

---

## 4. 加一个新的作品

**必须建两个文件**，中英各一份：

```
src/content/projects/zh/my-project.md
src/content/projects/en/my-project.md
```

文件名（去掉 `.md`）就是 URL 的 slug → 生成 `/work/my-project/` 和 `/en/work/my-project/`。

frontmatter 字段（schema 定义在 `src/content.config.ts`）：

```yaml
---
title: My Project                      # 项目名
tagline: 一句话说明它是干什么的          # 首页列表和详情页副标题
lang: zh                               # 这个文件的语言，zh 或 en
order: 3                               # 首页排序，越小越靠前
period: '2026 — 进行中'                 # 时间，注意加引号（见下面的坑）
role: 独立开发                          # 你的角色
stack: ['Python', 'FastAPI']           # 技术标签数组
repo: https://github.com/archibald-nice/my-project   # 必须是合法 URL
---
```

正文就是 Markdown，直接写在 frontmatter 下面。建议结构：**问题是什么 → 怎么做的 → 关键取舍 → 现状**。

### 坑 1：YAML 会把纯数字日期解析成数字

```yaml
period: 2026         # ✗ 被解析成 number，构建直接失败
period: '2026'       # ✓
```

实测报错：

```
[InvalidContentEntryDataError] projects → zh/bloodline data does not match collection schema.
  period: Expected type `"string"`, received `"number"`
```

**规则：`period` 一律加引号。** 只要含数字就加，别赌。

### 坑 2：`repo` 必须是完整 URL

`repo: github.com/xxx` 会失败，schema 用的是 `z.string().url()`，要带 `https://`。

### 加完之后

- 首页作品列表自动出现（受 `order` 排序）
- `/work/<slug>/` 详情页自动生成，不用手动建路由
- sitemap 自动更新
- 如果只建了一种语言，另一种语言的首页就不会出现它 —— 不会报错，但很容易忘

---

## 5. 双语规则

- **中文在根路径**（`/`、`/about/`），**英文在 `/en/`**。由 `astro.config.mjs` 里的
  `i18n.routing.prefixDefaultLocale: false` 控制。
- 所有 UI 文案都在 `src/i18n/ui.ts` 里按 `zh` / `en` 成对定义。
- **新增页面必须成对**：`src/pages/xxx.astro` + `src/pages/en/xxx.astro`。
- 每一页都要给 `Base` 传 `altHref`（另一语言的同一页地址）。
  hreflang 标签和右上角切换按钮都靠它 —— 传错了会导致英文用户点切换跳到中文首页。

```astro
<Base lang="zh" title="..." description="..." altHref="/en/xxx/" current="home">
```

---

## 6. 图片

- 图片放 `public/` 下，用根路径引用：`public/me.png` → `<img src="/me.png">`。
  `public/` 里的东西会原样拷进产物根目录。
- 旧博客的图片在 `public/imgs/`（47MB，多是壁纸，可以压）。
- 放在 `src/assets/` 可以让 Astro 自动优化尺寸和格式，但需要 `import` 引用，目前没用这套。

---

## 7. 写新文章（**目前不支持，需要先加 posts 集合**）

现状：`/blog/`、`/archives/` 全是 2025-08 之前 Hexo 生成的死 HTML，**写不了新文章**。
Astro 站这边也还没有文章功能。

要支持写文章，需要加一个 `posts` 内容集合（`src/content/posts/{zh,en}/`）+ 列表页 + 详情页
+ 可选 RSS。这是一次性的搭建工作，**尚未实施**。

在它搭好之前，写新文章只有两条路，都不推荐：

1. 手写 HTML 放进 `public/`（没有模板、没有 sitemap、没有样式）
2. 重新用 Hexo 生成再拷进 `public/`（需要重建 Hexo 源文件，等于从头来）

---

## 8. 构建失败排查

| 报错关键词 | 原因 | 怎么修 |
|---|---|---|
| `does not match collection schema` + `Expected type "string", received "number"` | frontmatter 里的日期没加引号 | 给 `period` 之类加 `'` 引号 |
| `Expected type "string", received "undefined"` | frontmatter 缺字段 | 对照 §4 的字段表补齐 |
| `Invalid url` | `repo` 不是完整 URL | 加 `https://` |
| `Missing about page content for lang=xx` | 删了 `src/content/pages/about-{zh,en}.md` | 补回来 |
| `EPERM ... /Users/xxx/Library/Preferences/astro` | 沙箱拦了遥测写入 | `ASTRO_TELEMETRY_DISABLED=1` |
| `EPERM ... /Users/xxx/.npm/_cacache` | 沙箱拦了 npm 缓存 | `--cache ./.npm-cache` |

构建前先跑 `npm run build` 就能挡住 90% 的问题 —— schema 校验会直接报错，不会带着坏数据上线。

---

## 9. 部署与回滚

### 部署

`main` 分支每次 push 触发 `.github/workflows/deploy.yml`：

```
npm ci → npm run build → 上传 dist/ → 发布到 GitHub Pages
```

看构建状态和日志：

```bash
gh run list --workflow=deploy.yml --limit 5
gh run watch <run-id> --exit-status
gh run view <run-id> --log-failed        # 只看失败的那一步
```

### Pages 的关键配置（别乱改）

```bash
gh api repos/archibald-nice/archibald-nice.github.io/pages
```

必须是：

```json
{ "build_type": "workflow", "status": "built" }
```

如果哪天变成 `legacy`（Deploy from a branch），Pages 会去直接发布 `main` 分支根目录 ——
那里只有 Astro 源码，站点会变成 404。改回来：

```bash
gh api -X PUT repos/archibald-nice/archibald-nice.github.io/pages -f build_type=workflow
```

### 回滚

历史从未被重写（没有 force push），所以随便回：

```bash
git revert <commit>          # 想保留历史
git reset --hard <commit>    # 想直接退回去（要 force push）
git push origin main
```

**已知可用的还原点**：

| commit | 状态 |
|---|---|
| `a6a84a3` | 迁移前的原始 Hexo 博客 |
| `f1f514b` | Astro 新站首次上线 |
| `3379dbe` | Actions 升级到 Node 24 版本 |

---

## 10. 不要做的事

- **别删 `public/.nojekyll`**。如果哪天退回分支发布模式，Jekyll 会忽略 `_astro/` 目录，页面直接丢样式。
- **别删 `public/blog/index.html`**。旧博客首页是靠它撑着的（新站首页占用了根路径，所以它被放在 `/blog/`）。
- **别在 `public/` 根下放 `index.html`**。产物根目录的 `index.html` 归 Astro 生成，会和它争同一个路径。
- **别把 `dist/` 提交进仓库**（已在 `.gitignore`）。产物由 Actions 构建。
- **别改 `astro.config.mjs` 里的 `site` 字段**。写错会让 canonical 和 sitemap 里的域名全错。

---

## 11. 当前已知的内容缺口

旧 Hexo 博客自带 4 条死链（迁移前就存在，非新站问题）。要么补内容，要么从 HTML 里删掉链接：

| 死链 | 出现位置 |
|---|---|
| `/notes/java_script` | `notes/`、`wiki/` 等页面的导航 |
| `/wiki/archie-life/matters_of_fitness` | `wiki/` 系列 |
| `/bookmark/` | `public/2024/01/01/hello-world/` |
| `/assets/wiki/stellar/photos/hello@1x.png` | `public/2024/01/01/hello-world/` |

另外：`public/imgs/` 有 47MB 未压缩图片，可以用 `sips` 批量压一遍。
