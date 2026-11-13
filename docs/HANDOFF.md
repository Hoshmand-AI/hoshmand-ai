# Hoshmand AI — Handoff for Claude (support@hoshmand.ai)

Paste this whole note into a new Claude Code session on the `Hoshmand-AI/hoshmand-ai` repo.
Last updated: November 2, 2026.

## What exists

| Thing | Where | Status |
|---|---|---|
| Company site | GitHub `Hoshmand-AI/hoshmand-ai` → Vercel project `hoshmand-ai` → https://www.hoshmand.ai | Live, `main` auto-deploys to production |
| Planora app | GitHub `Hoshmand-AI/planora` → Vercel project `planora` → https://planora-chi.vercel.app | Live, invite-only sign-up |
| MailHandled app | Vercel project `mailhandled` → https://mailhandled.ai | Private beta, invite only (Google verification pending) |
| Instagram | https://www.instagram.com/hoshmand.ai.studio/ (@hoshmand.ai.studio) | MailHandled post, reel and story are up |

Vercel team: "Hoshmand-AI's projects" (slug `hoshmand-ais-projects`).

## The website today (hoshmand.ai)

- Next.js 14 App Router, Tailwind v3, Framer Motion 11.3.28 (pinned).
- Products shown (order matters): **MailHandled, Planora, SafeClaw**. All data lives in `lib/projects.ts`.
  - MailHandled: "Open MailHandled" → mailhandled.ai, note "Private beta · invite only during Google verification", "See MailHandled on Instagram" links.
  - Planora: "Open Planora" → planora-chi.vercel.app, "Invite-only beta".
  - SafeClaw: no outside link, "Notify me when it ships" waitlist.
- **Removed for now:** MindCue AI and Care360. `/mindcue` redirects to `/products` (temporary, in `next.config.mjs`). Code is in git history if they come back.
- `/privacy` and `/terms` are MindCue's legal pages and must stay live (the App Store listing links to them).
- Design: Apple-style. Navy + warm neutrals + gold `#C8963E`, DM Serif Display headings, DM Sans body. Frosted navbar, spring animations, scroll reveals, collapsible sections, pointer-glow cards. Respects reduced motion and reduced transparency.
- Home hero: `components/home/MorphStage.tsx`, one shape morphing through the products driven by a cursor. Note: the SafeClaw notes and Planora task names in it are placeholder demo content.
- Gold scroll-progress bar at the top of every page.
- Footer: Instagram + LinkedIn links, "Built by Hoshmand AI".

## Planora

- Hosted service on Vercel is invite-only by default (`src/lib/server/signup-policy.ts`; `PLANORA_SIGNUP=open` in Vercel reopens sign-up). Sign-in page explains the invite-only beta.
- Recent Planora PRs (#51–#54) call the product **"RunF9"**. Open question for the owner: has Planora been renamed RunF9? If yes, update the name, wordmark, description and link on hoshmand.ai.

## How the owner (Ahmad) likes to work

- Explain the plan in plain language before big changes.
- Work on a branch, open a PR, run `npm run build` (and `npx tsc --noEmit`), check screenshots.
- **Always ask before merging** to `main` on either repo, even though Planora's CLAUDE.md says Claude may self-merge. Merging deploys to production.
- After merging, confirm the Vercel production deploy is Ready and the live page shows the change.
- Copy for product cards should be simple and plain-language.
- Never put live demo links for unreleased products on the site.

## Open items

1. Planora → RunF9 rename on hoshmand.ai (waiting on owner).
2. Replace placeholder demo content in the hero animation with real examples if the owner sends them.
3. The footer's "Privacy Policy" / "Terms of Service" are MindCue's pages; consider a company-wide privacy page later.

## Setting up the new account

1. Sign in to claude.ai as support@hoshmand.ai.
2. Connect GitHub with access to the **Hoshmand-AI** organization (both repos).
3. Add the **Vercel** connector for the "Hoshmand-AI's projects" team.
4. Start a Claude Code session on `Hoshmand-AI/hoshmand-ai` (add `Hoshmand-AI/planora` when needed) and paste this note.
