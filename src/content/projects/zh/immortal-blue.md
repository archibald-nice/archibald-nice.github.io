---
title: 浮生
tagline: 每天一个主题，把复杂信息做成能读、能点、能筛的知识看板
lang: zh
order: 2
period: 2026 — 进行中
role: 独立开发（生成流水线 → 数据层 → 阅读前端）
stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'ECharts', 'Supabase', 'PostgreSQL', 'GitHub Actions', 'Vercel']
repo: https://github.com/archibald-nice/daily-knowledge-board
demo: https://daily-knowledge-board.vercel.app
---

知识类内容的成本从来不在「写」，而在「组织」：一个行业、一个事件、一个人物，查多久、怎么落成结构、配什么图、用什么形式呈现 —— 这些活每篇都要重来一遍。浮生（Immortal Blue）想验证的是：如果把这套流程整个交给流水线，人只负责定义「什么样的内容算合格」，产出还能不能保持体面。

## 每天是怎么生成出来的

- GitHub Actions 定时三次（北京时间 08:00 / 16:00 / 24:00）触发，跑 `api/scripts/daily-generate.js`，直接调 LLM、写完 Supabase 就结束
- 选题去重做了两道：prompt 里塞进最近 30 个已发布选题当排除列表；`topics.slug` 上有唯一约束兜底，撞了就换选题重试（最多 3 次）
- 生成之外还有两件事一起跑：标签抽取和封面图检索 —— 于是一条内容落库时就已经是可筛选、有图的完整状态
- 每个阶段的耗时记进 `phase_timings`，页面上能直接看到这条内容生成了多久

## 关键取舍

- **生成不放在 Vercel serverless 里。** Vercel 函数 300 秒超时，跑不完一次完整生成（LLM 正文 + 标签 + 配图）。改成在 Actions 的 runner 上跑 Node 脚本，Vercel 只负责托管前端。
- **模型是适配层之后的配置，不是代码里的常量。** OpenAI / Anthropic / DeepSeek 走同一套接口，按模型上下文窗口算安全的 max tokens，顺带估算成本；换模型只改环境变量。
- **截断要能自己发现。** 输出被上下文吃断时，自动换紧凑 prompt 重试一次，而不是往库里塞半截内容。
- **内容是数据，不是文件。** 存在 Supabase 里，因为要按分类、日期、标签做查询，用 Markdown 文件做这些很别扭。

## 现状

已上线，每天自动生成并发布。还没做的是用户体系（订阅、收藏）和 SSR —— 目前是纯 Vite 的 SPA，SEO 是已知短板。
