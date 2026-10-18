---
title: Silicon River
tagline: Turning the daily flood of model releases into a timeline you can watch, click and query
lang: en
order: 1
period: '2025 — ongoing'
role: 'Solo build: data pipeline → API → 3D frontend'
stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'Three.js', 'TypeScript', 'DeepSeek', 'Docker']
repo: https://github.com/archibald-nice/SiliconRiver
demo: https://siliconriver.vercel.app
---

Model releases move far faster than anyone can track by hand. Every day brings new weights, new benchmark scores, new pricing — scattered across Hugging Face, OpenRouter, vendor blogs and X. Answering "what actually happened this week" is unreasonably expensive.

Silicon River is my answer to that. Not another static list, but a 3D spiral timeline: nodes can be clicked and locked for focus, showing full model metadata and pricing, with multi-dimensional filtering by time range, provider, license and keyword.

## How the data gets in

- Python scrapers pull the public Hugging Face and OpenRouter catalogues on a schedule; every sync writes a sync log, so it stays auditable and traceable
- Structured results land in PostgreSQL, with caching and incremental updates
- FastAPI exposes `/api/timeline` and friends to the frontend

## What "AI-enhanced" actually adds

This is the layer I put the most effort into, because it decides whether the timeline is data shuffling or genuinely useful:

1. **Real-time web search** (Brave Search API) — pulls public information around a release, solving the "the model is on the leaderboard but nobody wrote down what it is" problem
2. **Multi-leaderboard cross-validation** — queries SWE-bench, LMSYS Arena and the Hugging Face Leaderboard together, so no single leaderboard's bias steers the result
3. **LLM profiling** — DeepSeek generates model descriptions from the web context plus leaderboard data
4. **Four-tier milestone detection** — strong keywords → weak keywords → timeline rank → leaderboard rank, narrowing layer by layer to surface the releases that actually mattered

## Engineering trade-offs

- **Degrade first**: when any external dependency (search, leaderboards, LLM) is down, the service returns a degraded result instead of erroring — the timeline itself is always available
- **Test coverage**: 75+ test cases across scrapers, leaderboard clients, web search and end-to-end enhanced analysis
- **Delivery**: one `docker-compose` brings it up; the frontend ships as its own nginx image, plus a frontend-only compose for UI work
- **Observability**: phase four added production-grade performance monitoring and operational runbooks

## Status

Actively iterating. Backend is Python + FastAPI + PostgreSQL; frontend is React + Three.js.
