# Saraf

**Autonomous AI trading agent for Bitcoin, Oil, and Gold.** A Hoshmand AI product.

Saraf connects to your own brokerage, decides when to buy and sell using
transparent rules under hard risk limits, and proves itself on a simulated
account before a single real dollar is at risk. You keep custody of your funds;
Saraf only places orders.

> **Not financial advice.** Saraf is a tool. Markets carry risk and past
> performance never guarantees future results. Trade only money you can afford
> to lose.

---

## What it does

- **Autonomous agent** — reads Bitcoin (`BTC/USD`), Oil (`USO` ETF) and Gold
  (`GLD` ETF) and decides buy / sell / hold on its own, sized under risk caps.
- **Honest backtest** — replays the agent over history and compares it to simply
  holding, so you can see whether trading actually beats doing nothing.
- **Your brokerage, your custody** — connects via a trade-scoped API key
  (Alpaca recommended — it trades all three from one account). Keys live in
  server env vars, never in the browser.
- **Risk controls** — kill switch, per-order cap, daily loss limit, and
  per-asset concentration cap, checked before every order.
- **Paper first** — everything runs simulated by default. Live trading is
  deliberately hard-gated behind an explicit server flag.
- **Installable** — a PWA you can add to your phone's home screen.

## Tech

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Broker adapters: Alpaca (implemented), Coinbase (implemented, ES256 JWT auth)
- Deploys on Vercel; autonomy via Vercel Cron (`/api/saraf/tick`)

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # optional — paper simulation works with no keys
npm run dev
# open http://localhost:3000  → redirects to /saraf
```

## Deploy & go live

See **[docs/SARAF_DEPLOYMENT.md](docs/SARAF_DEPLOYMENT.md)** for the full path:
deploy to Vercel → connect Alpaca **paper** keys → enable the autonomous cron →
go live with real money behind small caps and a kill switch.

## Routes

| Path | What |
|------|------|
| `/saraf` | Agent console — decisions, backtest, paper portfolio, trade log |
| `/saraf/connections` | Connect a brokerage; test the connection |
| `/saraf/risk` | Your risk controls (kill switch, caps) |
| `/api/saraf/execute` | Server order gateway (risk-gated) |
| `/api/saraf/account` | Read-only connection test + live account |
| `/api/saraf/tick` | One autonomous decision cycle (for Vercel Cron) |

---

© Hoshmand AI. Trading your **own** account is fine. Trading other people's money
is regulated money management (registration, custody, KYC/AML) and needs legal
counsel before launch — the software alone does not make it lawful.
