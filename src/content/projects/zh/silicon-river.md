---
title: Silicon River
tagline: 把每天散落各处的模型发布，收成一条能看、能点、能查的时间线
lang: zh
order: 1
period: 2025 — 进行中
role: 独立开发（数据管道 → 服务端 → 3D 前端）
stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'Three.js', 'TypeScript', 'DeepSeek', 'Docker']
repo: https://github.com/archibald-nice/SiliconRiver
demo: https://siliconriver.vercel.app
---

大模型的发布速度已经远超任何人手工跟踪的能力。每天都有新的权重、新的榜单成绩、新的定价，散落在 Hugging Face、OpenRouter、各家的博客和 X 上。想搞清楚「这周到底发生了什么」，成本高得离谱。

Silicon River 要解决的就是这个。它不是又一个静态列表，而是一条 3D 螺旋时间线：节点可以点开锁定，查看完整的模型元数据和定价，配合时间范围、厂商、许可证、关键词等多维筛选。

## 数据是怎么进来的

- Python 爬虫定时抓取 Hugging Face 与 OpenRouter 的公开目录，每次同步写 sync log，可审计、可回溯
- 结构化后落 PostgreSQL，支持缓存与增量更新
- FastAPI 暴露 `/api/timeline` 等接口给前端

## 「AI 增强」具体增强了什么

这一层是我花力气最多的地方，因为它决定了这条时间线是「数据搬运」还是「真的有用」：

1. **实时联网**（Brave Search API）—— 拉取模型发布前后的公开信息，解决「模型已经上榜但没人写清楚它是什么」的问题
2. **多榜单交叉验证** —— 同时对接 SWE-bench、LMSYS Arena、Hugging Face Leaderboard 三个权威来源，避免被单一榜单的偏差带跑
3. **LLM 生成画像** —— DeepSeek 结合联网上下文与榜单数据，生成模型描述
4. **四层里程碑判定** —— 强关键词 → 弱关键词 → 时间线排名 → 榜单排名，逐层收敛，识别出真正重要的发布

## 工程上的几个取舍

- **降级优先**：任何一个外部依赖（搜索、榜单、LLM）挂掉时返回降级结果而不是报错，时间线本身永远可用
- **测试覆盖**：75+ 测试用例，覆盖爬虫、榜单客户端、联网搜索与端到端增强分析
- **交付形态**：docker-compose 一键起；前端单独打 nginx 镜像，另外提供 frontend-only 的 compose 便于只调试前端
- **可观测**：第四阶段补上了生产级性能监控与运维 runbook

## 现状

持续迭代中。后端 Python + FastAPI + PostgreSQL，前端 React + Three.js。
