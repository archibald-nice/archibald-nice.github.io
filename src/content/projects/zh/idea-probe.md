---
title: Idea Probe
tagline: 跑在自己机器上的灵感引擎：Reddit 热帖过一遍 LLM，只留下 claim 和 evidence
lang: zh
order: 2
period: 2026 — MVP
role: 独立开发
stack: ['Python', 'DeepSeek', 'Reddit API']
repo: https://github.com/archibald-nice/idea-probe-univers
---

我不想要一个「AI 摘要器」—— 摘要读完就完了，第二天什么都不剩。我想要的是把别人的观点拆成可验证的最小单元，然后和已有归档比对，看哪些是新出现的、哪些是反复被提起的。

Idea Probe 就是这个：输入 Reddit 热帖，输出结构化的 `claim + evidence` 条目，归档成兼容已有格式的 `archive.jsonl`。

## 流程

1. 抓取 Reddit 热帖（需要 `REDDIT_CLIENT_ID` / `SECRET`，走代理）
2. 用 DeepSeek 把帖子提炼成 claim + evidence 结构
3. 归档成兼容存量格式的 `archive.jsonl`，便于后续检索与比对

## 工程细节

- **先写 PRD 再写代码**，而且 PRD 里专门有一节「现实校准」，先把哪些是理想、哪些是这一版真能做的分清楚
- **`--check` 体检命令**：一条命令同时验证 API key 连通性、代理可达性、Reddit 通道，直接出报告 —— 这类依赖多个外部服务的脚本，报错定位往往比写功能更耗时间
- **状态诚实**：当前是 MVP，离线自测已通过；剩下的待办是填 key、接入存量归档格式做比对、安装调度

## 为什么值得做

信息获取的瓶颈早就不在「看到」，而在「记住并比对」。这个项目的目标是把阅读变成可累积的结构化资产，而不是每天刷新一遍就遗忘的信息流。
