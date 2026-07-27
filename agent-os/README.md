# Hoshmand Agent OS

A team of personal AI agents for Sediq / Hoshmand AI, built on the Anthropic API.
Each agent owns one slice of daily life (email, calendar, social, gym); a
coordinator merges their reports into one morning brief. Every outward action is
human-in-the-loop: email replies land as Gmail drafts, social posts (v2) go
through an approval queue — nothing is auto-sent.

> **Note:** this currently lives inside the website repo as staging. It should be
> moved to its own private repository (`Hoshmand-AI/agent-os`) — see "Moving to
> its own repo" below.

## Status

| Agent | Status |
|---|---|
| `email` | ✅ Working — triage + labels + reply drafts for all configured Gmail accounts |
| `coordinator` | ✅ Working — merges agent reports into `briefs/<date>.md` |
| `calendar` | 🔜 v2 stub |
| `social` | 🔜 v2 stub (X, LinkedIn page, IG/FB business — official APIs only) |
| `gym` | 🔜 v2 stub (awaiting spec) |
| custom agents | ✅ Framework ready — `new CustomAgent(name, description, task)` in `registry.ts` |

## Layout

```
packages/core     agent framework: BaseAgent, Claude helpers (structured outputs),
                  file store, approval queue
packages/agents   the team: email, calendar, social, gym, coordinator, custom
apps/worker       CLI runner (cron-able)
scripts           gmail-auth.ts — one-time OAuth per Gmail account
```

## Setup

1. `npm install`
2. `cp .env.example .env` and fill in:
   - `ANTHROPIC_API_KEY` — from console.anthropic.com
   - Google OAuth client: create a project at console.cloud.google.com, enable the
     **Gmail API**, create an OAuth client, set `GOOGLE_CLIENT_ID/SECRET`
3. Per Gmail account: `npm run gmail-auth`, sign in as that account, paste the
   printed refresh token into `.env`
4. Run:

```bash
npm run agent -- list     # show the team
npm run agent -- email    # triage all inboxes, create drafts
npm run agent -- all      # run everyone; coordinator writes .data/briefs/<date>.md
```

Models default to `claude-opus-5`; override globally with `AGENT_MODEL` or per
agent with `AGENT_MODEL_EMAIL` etc.

## Design principles

- **Human-in-the-loop by default.** Agents prepare; Sediq approves. Trust is the product.
- **Official APIs only.** No personal-WhatsApp/iMessage automation, no LinkedIn
  engagement bots — platform walls are respected (they get accounts banned).
- **One agent, one job.** Extensibility = add an entry to `registry.ts`.
- **Structured outputs everywhere.** Claude responses are Zod-validated
  (`messages.parse` + `zodOutputFormat`), never free-text parsed.

## Roadmap

1. **Weeks 1–2 (validation):** run `email` daily on both personal accounts; track
   hours saved, % of drafts sent unedited, misses.
2. Calendar agent + morning brief on a schedule (GitHub Actions cron or a small
   worker host).
3. Next.js dashboard (brief + approval queue) on Vercel.
4. Social agent: X pay-per-use API, LinkedIn Community Management API, Meta Graph API.
5. Gym agent per spec.

## Moving to its own repo

Create a **private** repo `Hoshmand-AI/agent-os` on GitHub, then:

```bash
git clone https://github.com/Hoshmand-AI/hoshmand-ai
cd hoshmand-ai && git checkout claude/agentic-ai-productivity-4slws5
cp -r agent-os /tmp/agent-os && cd /tmp/agent-os
git init && git add -A && git commit -m "feat: Agent OS v0.1 scaffold"
git remote add origin https://github.com/Hoshmand-AI/agent-os.git
git push -u origin main
```
