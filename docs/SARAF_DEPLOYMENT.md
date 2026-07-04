# Saraf — Deployment & Go-Live Guide

This is the exact path from "code in a repo" to "an autonomous agent trading
my own money." Read it in order. **Do not skip the paper stage.**

Saraf is a Next.js app. It has two runtime pieces:

1. **The web app** — the dashboard, risk controls, and connection UI.
2. **The autonomous tick** (`/api/saraf/tick`) — one decision cycle, meant to
   be called on a schedule so the agent acts without you watching.

---

## Why you can't "see it live" inside Claude Code

The app runs on `localhost` inside a temporary cloud container while I build
it. That container isn't exposed to your browser, which is why there's no
clickable window here — screenshots are how I show you the running app. To get
a real, always-on URL you can open on any device, you **deploy it**. That's
this guide.

---

## Stage 1 — Deploy the web app (gives you a live URL)

1. Push this branch to GitHub (already done): `claude/trading-app-alerts-xxkpyw`.
2. Go to [vercel.com](https://vercel.com), "Add New → Project", import the
   `hoshmand-ai/hoshmand-ai` repo.
3. Framework preset **Next.js** is auto-detected. Deploy.
4. You now have a live URL, e.g. `https://your-app.vercel.app/saraf`. Open it on
   your phone and **Add to Home Screen** — the PWA makes it a real app icon.

At this point everything runs in **paper mode**. No money can move.

---

## Stage 2 — Connect Alpaca **paper** trading (real broker, fake money)

Alpaca is the recommended broker because one account trades all three of your
assets: **Bitcoin (`BTC/USD`)**, **Oil (`USO`)**, **Gold (`GLD`)**.

1. Create a free account at [alpaca.markets](https://alpaca.markets).
2. Switch to **Paper Trading** and generate a **paper** API key + secret.
3. In Vercel → Project → Settings → Environment Variables, add:

   | Variable | Value |
   |---|---|
   | `ALPACA_API_KEY_ID` | your paper key id |
   | `ALPACA_API_SECRET_KEY` | your paper secret |
   | `SARAF_MAX_NOTIONAL_USD` | `25` (start small) |
   | `SARAF_LIVE_ENABLED` | `false` |

4. Redeploy. Orders now route to Alpaca's paper endpoint — real order plumbing,
   fake money. Watch the trade log and the backtest for a few weeks.

**This is where you prove Saraf to yourself.** If it can't beat holding on
paper, it has no business touching real money.

---

## Stage 3 — Turn on autonomy (trade while you sleep)

Add a Vercel Cron job so the agent ticks on a schedule. In `vercel.json`:

```json
{
  "crons": [{ "path": "/api/saraf/tick?key=YOUR_CRON_SECRET", "schedule": "*/30 * * * *" }]
}
```

Add `CRON_SECRET` as an env var with the same value so only the scheduler can
trigger the tick. The tick skips markets that are closed (oil/gold ETFs
off-hours) and reports each cycle's decisions. Bitcoin trades 24/7; the ETFs
only during US market hours.

---

## Stage 4 — Go live with real money (deliberate, reversible)

Only after Stage 2 has earned your trust:

1. In Alpaca, fund a **live** account and generate **live** API keys.
2. Replace the env values with the live key/secret.
3. Set `SARAF_LIVE_ENABLED=true`.
4. Keep `SARAF_MAX_NOTIONAL_USD` small (your $100 means caps like `$10–25`).
5. The **kill switch**: set `SARAF_KILL_SWITCH=true` to halt everything server-
   side instantly. The in-app kill switch (Risk page) halts from the client.

Real money now moves. Start with the smallest caps and widen them only as the
track record justifies it.

---

## The rules that keep you safe

- **Keys never touch the browser.** They live only in Vercel's encrypted env.
- **Two caps, always.** The server cap (`SARAF_MAX_NOTIONAL_USD`) is the hard
  limit; your in-app Risk settings sit on top.
- **Withdrawal scope off.** Create API keys with **trade** permission only,
  never withdrawal. Saraf can trade your account; it can never move money out.
- **You keep custody.** Funds stay in your Alpaca account. Saraf only places
  orders.

## The legal line

Trading **your own** account like this is fine. The moment Saraf trades **other
people's** money, it becomes regulated money management (RIA/broker-dealer
registration, custody, KYC/AML) and needs a lawyer before launch. The software
does not make that step legal on its own.
