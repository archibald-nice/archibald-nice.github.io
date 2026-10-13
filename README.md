# archie-home

大梁（Archibald）的个人主页 —— 作品集 + 个人品牌站，托管在 GitHub Pages。

线上地址：<https://archibald-nice.github.io>

## 这个仓库是什么

这是 `archibald-nice.github.io` 用户站的**源码仓库**（GitHub Actions 构建后发布到 Pages）。
它由两部分组成：

| 部分 | 位置 | 说明 |
|---|---|---|
| 新站（Astro） | `src/` | 作品集首页、关于页、项目详情页，中英双语 |
| 旧博客（Hexo 产物） | `public/` | 2025-08 之前用 Hexo + Stellar 生成的**静态产物**，原样平移，路径未变 |

> ⚠️ **旧博客的 Hexo 源文件（`_config.yml` / `source/`）已丢失**，`public/` 下是编译好的 HTML。
> 因此旧博客只能以静态形式保留，无法再用 Hexo 重新生成。
> 要改旧博客的文字，直接编辑 `public/**/index.html`；要写新文章，走下面的 Astro 内容目录。

## 目录结构

```
├── .github/workflows/deploy.yml   # Actions：构建并发布到 Pages
├── public/                        # 原样拷进产物根的静态文件
│   ├── .nojekyll                  # 防止 Jekyll 吞掉 _astro/
│   ├── blog/index.html            # 旧 Hexo 博客首页（原根 index.html 平移而来）
│   ├── archives/ categories/ tags/ wiki/ notes/ notebooks/ more/
│   ├── 2024/ 2025/                # 旧文章，路径保持不变
│   └── css/ js/ imgs/ search.json # 旧博客资源
└── src/
    ├── consts.ts                  # 站点常量（邮箱、GitHub、博客路径）——改这里
    ├── i18n/ui.ts                 # 双语 UI 文案
    ├── content/
    │   ├── projects/{zh,en}/*.md  # 精选作品，每个文件生成详情页
    │   └── pages/about-{zh,en}.md # 关于页长文
    ├── data/other.ts              # 次要项目 + 关注的开源项目
    ├── layouts/Base.astro         # HTML 骨架、页头页脚、主题切换
    ├── components/                # Home / About / WorkDetail / WorkItem
    ├── styles/global.css          # 设计令牌 + 全部样式（手写，无 Tailwind）
    └── pages/                     # 路由（zh 在根、en 在 /en/）
```

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
npm run preview    # 预览构建产物
```

**在受限沙箱里跑**（例如 DSH / WorkBuddy 这类文件沙箱）：

```bash
# npm 缓存在工作区外会被拒，指到工作区内
npm install --cache ./.npm-cache --registry=https://registry.npmmirror.com

# Astro 遥测要写 ~/Library/Preferences/astro，同样被拒
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

## 怎么改内容

| 想改什么 | 改哪个文件 |
|---|---|
| 邮箱 / GitHub / 博客链接 | `src/consts.ts` |
| 首页自我介绍、slogan、按钮文案 | `src/i18n/ui.ts` 的 `hero` |
| 技能分组与标签 | `src/i18n/ui.ts` 的 `ability` |
| 精选作品 | `src/content/projects/{zh,en}/` 下加/改 Markdown |
| 关于页长文 | `src/content/pages/about-{zh,en}.md` |
| 次要项目列表 | `src/data/other.ts` |
| 颜色 / 字号 / 间距 | `src/styles/global.css` 顶部的 `:root` 设计令牌 |

## 双语与主题

- **路由**：中文在根路径（`/`、`/about/`），英文在 `/en/`。由 `astro.config.mjs` 的
  `i18n.routing.prefixDefaultLocale: false` 控制。
- **新增页面**要成对建：`src/pages/xxx.astro` + `src/pages/en/xxx.astro`，
  并在 `Base` 上传 `altHref`（另一语言的地址），hreflang 和右上角切换按钮都依赖它。
- **主题**：默认跟随系统 `prefers-color-scheme`；用户手动点过之后写入 `localStorage.theme`
  并落到 `<html data-theme>`。无闪烁脚本内联在 `Base.astro` 的 `<head>` 里。
- **字体**：只用系统字体栈，不加载网络字体（中文 webfont 体积太大，拖慢首屏）。

## 部署

`main` 分支的每次推送触发 `.github/workflows/deploy.yml`：`npm ci` → `npm run build`
→ 上传 `dist/` → 发布到 GitHub Pages。

Pages 的 Source 必须设为 **GitHub Actions**（不是 "Deploy from a branch"）。
用 API 检查／修改：

```bash
gh api repos/archibald-nice/archibald-nice.github.io/pages                      # 看 build_type
gh api -X PUT repos/archibald-nice/archibald-nice.github.io/pages -f build_type=workflow
```

`public/.nojekyll` 必须保留：如果哪天退回分支发布模式，Jekyll 会忽略 `_astro/` 目录，
页面会丢样式。

## 已知内容缺口（旧博客遗留，非新站问题）

全站内链已做完整回归检查，新站**零断链**。以下 4 条是旧 Hexo 博客原本就存在的死链，
需要你决定是补内容还是删链接：

| 死链 | 出现位置 |
|---|---|
| `/notes/java_script` | `notes/`、`wiki/` 等页面的导航 |
| `/wiki/archie-life/matters_of_fitness` | `wiki/` 系列页面 |
| `/bookmark/` | `2024/01/01/hello-world/` |
| `/assets/wiki/stellar/photos/hello@1x.png` | `2024/01/01/hello-world/` |

另外 `public/imgs/` 有 47MB 未压缩图片（多为壁纸），会拉高仓库体积和克隆时间，
后续可以用 `sips` 批量压一遍。

## 历史

- 2024–2025：Hexo 7.3.0 + Stellar 1.31.1 静态博客
- 2026-10：改为 Astro 站点，旧博客产物平移进 `public/`，保留原始路径与全部外链
