---
title: Idea Probe
tagline: An idea engine on my own machine — Reddit threads through an LLM, keeping only claims and evidence
lang: en
order: 2
period: '2026 — MVP'
role: Solo build
stack: ['Python', 'DeepSeek', 'Reddit API']
repo: https://github.com/archibald-nice/idea-probe-univers
---

I did not want an "AI summariser" — a summary is read once and gone by the next morning. What I wanted was to break other people's arguments into verifiable minimum units, then compare them against an existing archive: what is genuinely new, and what keeps coming up again and again.

Idea Probe is that. Input: Reddit threads. Output: structured `claim + evidence` entries archived into a format-compatible `archive.jsonl`.

## The flow

1. Fetch Reddit hot threads (needs `REDDIT_CLIENT_ID` / `SECRET`, via proxy)
2. Use DeepSeek to distil each thread into claim + evidence structure
3. Archive into the existing `archive.jsonl` format, ready for later retrieval and comparison

## Engineering notes

- **PRD before code**, and the PRD has a dedicated "reality calibration" section that separates what is aspirational from what this version can genuinely do
- **A `--check` health command**: one command verifies API key connectivity, proxy reachability and the Reddit channel, and prints a report — for a script depending on several external services, locating the failure usually costs more time than writing the feature
- **Honest status**: it is an MVP today, offline self-tests pass, and the remaining to-dos are filling in keys, wiring up comparison against the existing archive format, and installing the scheduler

## Why it is worth building

The bottleneck in information gathering stopped being "seeing it" a long time ago — it is remembering it and comparing it. The point of this project is to turn reading into an accumulating structured asset instead of a feed that is refreshed and forgotten.
