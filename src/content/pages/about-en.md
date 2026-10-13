---
title: About
lede: Six years full-stack, from the server side up to interfaces and models.
lang: en
---

## Six years, from the server side to models

I'm Archibald (大梁), based in Shenzhen. I registered on GitHub in 2017, and those six years have mostly gone into one thing: taking something from "it runs" to "it ships".

I started on the server side — Java and Spring services, PostgreSQL data, the MyBatis persistence layer, Dubbo service meshes. What that period actually taught me wasn't fluency in a framework, but a habit: get the shape of the data right first, then think about APIs and interfaces. If the schema is wrong, it doesn't matter how pretty the code above it is.

Later I moved to the frontend. Not for the "full-stack" label, but because I kept finding that interface problems couldn't be fixed at the interface layer: a laggy filter usually means the data wasn't aggregated in the right place; a slow page usually means the render boundaries were drawn wrong from the start. Writing it myself is how I learned what to ask of the frontend.

## Now: AI-native

For the past two years my focus has moved to AI, but my definition of "AI-native" is probably not the popular one.

I don't really buy the idea that wiring up a model API makes something an AI product. Once you genuinely put an LLM into an engineering system, the hard parts are elsewhere: absorbing unstable output, degrading gracefully when external dependencies die, verifying what was generated, controlling cost — and most importantly, working out what the feature actually saves the user.

So my projects are mostly built around those questions:

- In **Silicon River**, I cross-validate three leaderboards and add a layer of live web search, because a single leaderboard gets steered by release strategy, and an LLM on its own will confidently make things up
- In **Idea Probe**, I insisted on splitting output into claims and evidence rather than producing a summary — summaries can't be compared, claims can
- **Bloodline API** looks unrelated to AI, but it's the same idea: turn things that were answered by asking someone and hoping into something queryable

## How I work

- **Write it down before building it.** Idea Probe started with a PRD, including a dedicated "reality calibration" section separating aspiration from what the version could genuinely do. That saved far more time than the writing cost.
- **Degrade first.** For any system with external dependencies, work out what happens when they're down before designing the happy path.
- **Tests are for my future self.** Of Silicon River's 75+ test cases, the useful ones are the ones that confirmed I hadn't broken something else after changing a data source.
- **Say when you don't know.** That goes in code comments and commit messages, and it goes here too.

## Stack

**Backend & data** — Java, Spring Boot, MyBatis-Plus, Dubbo, Python, FastAPI, PostgreSQL, Redis, Druid, JSqlParser

**Frontend** — TypeScript, React, Three.js, Vite, Umi Max, Tailwind

**AI** — LLM application design, DeepSeek, RAG, agent tooling, multi-source cross-validation, prompt engineering

**Engineering** — Docker, docker-compose, nginx, GitHub Actions, Vercel, pytest

## On what isn't open source

Some systems I've built are company projects, and that code isn't in public repositories. If you're assessing my engineering ability, the public projects here are the parts where I can explain *why* they're designed the way they are — I'd rather you judge from the trade-offs than from a feature list.

## Get in touch

Full-time roles, technical collaboration, or just a conversation about AI engineering — email [archibaldwan@163.com](mailto:archibaldwan@163.com).
