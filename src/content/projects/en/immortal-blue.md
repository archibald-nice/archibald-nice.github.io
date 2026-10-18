---
title: Immortal Blue
tagline: One topic a day, rendered as a knowledge board you can read, click and filter
lang: en
order: 2
period: '2026 — ongoing'
role: 'Solo build: generation pipeline → data layer → reading frontend'
stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'ECharts', 'Supabase', 'PostgreSQL', 'GitHub Actions', 'Vercel']
repo: https://github.com/archibald-nice/daily-knowledge-board
demo: https://daily-knowledge-board.vercel.app
---

The cost of knowledge content was never in the writing. It is in the organising: an industry, an event, a person — how long to research, how to shape it into structure, what image to pair it with, what form to present it in. All of that gets redone from scratch every single time. Immortal Blue (浮生) tests one question: if the whole pipeline is automated and a human only defines what "good enough" means, can the output still hold up?

## How a day gets generated

- GitHub Actions fires three times a day (08:00 / 16:00 / 24:00 Beijing time), running `api/scripts/daily-generate.js`, which calls the LLM and writes to Supabase
- Topic duplication is guarded twice: the prompt carries the 30 most recent published topics as an exclusion list, and a unique constraint on `topics.slug` catches whatever slips through, triggering a fresh topic pick (up to 3 attempts)
- Two more jobs run alongside generation — label extraction and cover-image search — so a record lands already tagged and illustrated
- Every phase's duration is recorded in `phase_timings`, and the page shows how long that piece of content took to generate

## Trade-offs

- **Generation does not run in a Vercel serverless function.** Vercel's 300-second limit can't fit a full generation (body text + labels + cover image). So a Node script runs on the Actions runner, and Vercel only hosts the frontend.
- **The model is configuration behind an adapter, not a constant in code.** OpenAI, Anthropic and DeepSeek share one interface, with safe max-token budgets computed from each model's context window and cost estimated along the way. Switching models means changing an environment variable.
- **Truncation has to detect itself.** When the output gets cut off by the context window, the pipeline retries once with a compact prompt rather than writing half a record to the database.
- **Content is data, not files.** It lives in Supabase because it has to be queried by category, date and label — things Markdown files do awkwardly.

## Where it stands

Live, generating and publishing on its own every day. Still missing: user accounts (subscribe, save) and SSR — it is a plain Vite SPA today, so SEO is a known weak spot.
