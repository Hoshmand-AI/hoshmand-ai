# Working in this repo

This repo contains the Hoshmand AI website (Next.js 14 + Tailwind, deployed on
Vercel at hoshmand.ai). Ahmad (sediq.ne@gmail.com) uses it as the home base
for AI-app sessions.

## Before building any NEW app for Ahmad — ask these questions first

Ahmad wants these settled up front, every time, before writing code:

1. **Location on his PC** — ask where the app should live in his local
   AI-apps folder. Remember: sessions run in a cloud container and cannot
   write to his PC; always give him the exact `git clone` command for his
   chosen folder.
2. **GitHub repo** — ask for the repo name and which account it goes under.
   He keeps personal projects and AI apps separate; AI apps belong under the
   `Hoshmand-AI` GitHub account. Standalone apps get their OWN repo, not a
   folder inside this website repo.
   - Known limitation: the session's GitHub integration CANNOT create new
     repositories (403). Ask Ahmad to create the empty repo at github.com/new,
     then have it added to the session and push the code.
3. **Hosting** — ask which platform/account (default: his Vercel account) and
   whether to deploy immediately or wait for credentials.
4. **Third-party services** — list every external API/service the app needs
   BEFORE building, with costs and who creates the account. Ahmad must
   personally create anything requiring billing or identity. Accounts he
   already has (reuse, don't recreate): Twilio, Google Cloud (Gmail API
   OAuth), Upstash (Redis + QStash), Vercel, GitHub.

## Existing apps

- **pango-agent** — Pango parking reminder agent (Twilio call loop +
  Gmail-receipt verification). Lives in its own public repo:
  `Hoshmand-AI/pango-agent`. On Ahmad's PC: `~/AI Projects/pango-agent`.
  Note the space in "AI Projects" — quote paths in shell commands.
