# archie-home

大梁（Archibald）的个人主页 —— 作品集 + 博客 + 个人品牌站，托管在 GitHub Pages。

- 线上地址：<https://archibald-nice.github.io>
- 内容后台：<https://archibald-nice.github.io/admin>（Sveltia CMS，GitHub 访问令牌登录）
- **维护手册：[docs/maintenance.md](docs/maintenance.md)** ← 日常改动、写文章、排查、回滚都看它

## 这个仓库是什么

这是 `archibald-nice.github.io` 用户站的**源码仓库**（GitHub Actions 构建后发布到 Pages）。
它由三部分组成：

| 部分 | 位置 | 说明 |
|---|---|---|
| 新站（Astro） | `src/` | 作品集、关于页、博客，中英双语 |
| 内容后台 | `public/admin/` | Sveltia CMS 的静态页面与配置，用 GitHub 令牌登录 |
| 旧博客（Hexo 产物） | `public/` 其余部分 | 2025-08 之前用 Hexo + Stellar 生成的**静态产物**，原样保留，路径未变 |

> ⚠️ **旧博客的 Hexo 源文件（`_config.yml` / `source/`）已丢失**，`public/` 下是编译好的 HTML。
> 它现在是一份只读归档，无法再用 Hexo 重新生成。
> 写新文章一律走 `src/content/posts/`（或内容后台）。

## 常用命令

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 校验内容 + 输出 dist/
npm run preview    # 预览构建产物

git add -A && git commit -m "..." && git push    # 推送后 1-2 分钟自动上线
```

**沙箱环境（DSH / WorkBuddy 等）额外需要**：

```bash
npm install --cache ./.npm-cache --registry=https://registry.npmmirror.com
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

**两个容易踩的坑**：`dev` / `preview` 只绑 IPv6，用 `localhost` 而不是 `127.0.0.1`；
本地看后台要用 `/admin/index.html`（dev server 不给 `public/` 下的目录补 `index.html`）。

## 目录结构

```
├── .github/workflows/deploy.yml   # Actions：构建并发布到 Pages
├── docs/maintenance.md            # 维护手册（不进站点产物）
├── public/                        # 原样拷进产物根的静态文件
│   ├── .nojekyll                  # 防止 Jekyll 吞掉 _astro/
│   ├── admin/                     # 内容后台（index.html + config.yml）
│   ├── robots.txt
│   ├── archives/ 2025/ wiki/ ...  # 旧博客内容，路径保持不变
│   └── css/ js/ imgs/ search.json
└── src/
    ├── consts.ts                  # 站点常量（邮箱、GitHub、各路径）
    ├── i18n/ui.ts                 # 双语 UI 文案 + 路径与日期工具
    ├── lib/posts.ts               # 文章的读取、分组、标签统计
    ├── content/
    │   ├── projects/{zh,en}/      # 作品集，每个文件生成详情页
    │   ├── posts/{zh,en}/         # 博客文章，语言由目录决定
    │   └── pages/about-{zh,en}.md # 关于页长文
    ├── data/other.ts              # 次要项目 + 关注的开源项目
    ├── layouts/Base.astro         # HTML 骨架、页头页脚、主题切换
    ├── components/                # Home / About / WorkDetail / BlogList / PostDetail / WorkItem
    ├── styles/global.css          # 设计令牌 + 全部样式（手写，无 Tailwind）
    └── pages/                     # 路由：中文在根，英文在 /en/
```

## 怎么改内容

> 完整步骤、字段说明、报错排查见 **[docs/maintenance.md](docs/maintenance.md)**。

| 想改什么 | 改哪个文件 |
|---|---|
| 邮箱 / GitHub / 后台链接 | `src/consts.ts` |
| 首页自我介绍、slogan、按钮文案 | `src/i18n/ui.ts` → `hero` |
| 技能分组与标签 | `src/i18n/ui.ts` → `ability` |
| 精选作品 | `src/content/projects/{zh,en}/*.md` |
| 博客文章 | `src/content/posts/{zh,en}/*.md`（或走 `/admin/`） |
| 关于页长文 | `src/content/pages/about-{zh,en}.md` |
| 次要项目列表 | `src/data/other.ts` |
| 内容后台的表单字段 | `public/admin/config.yml`（需与 `src/content.config.ts` 同步改） |
| 颜色 / 字号 / 间距 | `src/styles/global.css` 顶部的 `:root` 设计令牌 |

文章的语言由**所在目录**决定（`posts/zh/` → 中文，`posts/en/` → 英文），frontmatter 里不需要写 `lang`。

## 双语与主题

- **路由**：中文在根路径（`/`、`/about/`、`/blog/`），英文在 `/en/`。由 `astro.config.mjs` 的
  `i18n.routing.prefixDefaultLocale: false` 控制。
- **新增页面**要成对建：`src/pages/xxx.astro` + `src/pages/en/xxx.astro`，
  并在 `Base` 上传 `altHref`（另一语言的地址），hreflang 和右上角切换按钮都依赖它。
- **主题**：默认跟随系统 `prefers-color-scheme`；用户手动点过之后写入 `localStorage.theme`
  并落到 `<html data-theme>`。无闪烁脚本内联在 `Base.astro` 的 `<head>` 里。
- **字体**：只用系统字体栈，不加载网络字体（中文 webfont 体积太大，拖慢首屏）。
- **路径别名**：`@/*` 指向 `src/*`（见 `tsconfig.json`），避免按目录深度数 `../`。

## 部署

`main` 分支的每次推送触发 `.github/workflows/deploy.yml`：`npm ci` → `npm run build`
→ 上传 `dist/` → 发布到 GitHub Pages。

Pages 的 Source 必须是 **GitHub Actions**（不是 "Deploy from a branch"）：

```bash
gh api repos/archibald-nice/archibald-nice.github.io/pages
gh api -X PUT repos/archibald-nice/archibald-nice.github.io/pages -f build_type=workflow
```

`public/.nojekyll` 必须保留：如果哪天退回分支发布模式，Jekyll 会忽略 `_astro/` 目录，页面会丢样式。

**构建失败不会让站点挂掉** —— 实测故意推坏内容的结果是 `build: failure` + `deploy: skipped`，
线上继续提供上一次成功的版本。

## 已知内容缺口（旧博客遗留，非新站问题）

全站内链用 HTML 解析器做过完整检查（不是正则 —— 正则会误报正文里的代码示例），
新站与博客**零新增断链**。以下 6 条是旧 Hexo 博客原本就存在的死链：

| 死链 | 出现位置 |
|---|---|
| `/notes/java_script`、`/notes/java_script.md` | `notes/`、`wiki/` 等页面导航 |
| `/wiki/archie-life/matters_of_fitness(.md)` | `wiki/` 系列 |
| `/bookmark/` | `public/2024/01/01/hello-world/` |
| `/assets/wiki/stellar/photos/hello@1x.png` | `public/2024/01/01/hello-world/` |

另外 `public/imgs/` 有约 47MB 未压缩图片，会拉高仓库体积和克隆时间，可以用 `sips` 批量压一遍。

## 历史

- 2024–2025：Hexo 7.3.0 + Stellar 1.31.1 静态博客
- 2026-10：改为 Astro 站点，旧博客产物平移进 `public/`，保留原始路径与全部外链
- 2026-10：加入博客内容集合（中英双语）、标签页、RSS 与 Sveltia CMS 后台
