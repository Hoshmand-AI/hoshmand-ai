# Pango Reminder Agent 📞

When you drive ~0.5 miles away from your parents' house, this agent calls your
phone **back to back** (caller shows as **"Pango"**) until you press **1**,
reminding you to stop your Pango visitor-parking session. If you never press 1,
it gives up after 15 calls and sends a fallback SMS.

## How it works

```
iPhone leaves geofence
  └─ iOS Shortcuts automation fires a webhook ──► POST /api/trigger
       └─ Twilio calls your phone ("Pango" rings)
            ├─ You answer and press 1 ──► loop stops ✅
            ├─ Voicemail / no answer / ignored ──► redials immediately
            └─ After 15 unconfirmed calls ──► fallback SMS, loop stops
```

- Runs as a standalone Vercel project (serverless functions, no server to manage).
- Upstash Redis (free tier) remembers "did he press 1 yet?" between calls and
  stops duplicate call storms if the geofence fires twice.
- Voicemail picking up does **not** stop the loop — only pressing 1 does.

## Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /api/trigger` | `X-Trigger-Secret` header | Start the call loop (fired by your iPhone) |
| `POST /api/stop` | `X-Trigger-Secret` header | Kill switch — stop an active loop |
| `GET /api/status` | `X-Trigger-Secret` header | Inspect current/last session |
| `POST /api/voice` | Twilio signature | TwiML the caller hears |
| `POST /api/gather` | Twilio signature | Handles the "press 1" keypress |
| `POST /api/call-status` | Twilio signature | End-of-call callback; drives the redial loop |

## Setup (one time, ~25 minutes)

### 1. Twilio (~10 min, needs a credit card)

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio).
2. Verify your own cell number when prompted (trial accounts can only call verified numbers).
3. **Upgrade the account** (add ~$20): trial accounts prepend an annoying
   "you have a trial account" message to every call.
4. Buy a **local Virginia number**: Console → Phone Numbers → Buy a Number
   (~$1.15/month). Pick one with Voice + SMS capability.
5. Note your **Account SID** and **Auth Token** from the Console home page.

> **SMS caveat:** US carriers require A2P 10DLC registration for SMS from local
> numbers. If the fallback SMS doesn't arrive, either complete the (cheap,
> sole-proprietor) A2P registration in the Twilio console or just rely on the
> calls — the voice loop is unaffected.

### 2. Upstash Redis (~3 min, free)

1. Sign up at [console.upstash.com](https://console.upstash.com).
2. Create a Redis database (free tier, any region — pick `us-east-1`).
3. Note the **REST URL** and **REST Token** from the database page.

### 3. Deploy to Vercel (~5 min)

1. In [vercel.com](https://vercel.com) → **Add New → Project** → import this
   GitHub repo (`Hoshmand-AI/hoshmand-ai`).
2. **Set "Root Directory" to `pango-agent`** — this makes it a separate project
   from the main website.
3. Add the environment variables from `.env.example` (all the non-optional ones).
   Generate `TRIGGER_SECRET` with `openssl rand -hex 24` or any long random string.
4. Deploy. Note your deployment URL, e.g. `https://pango-agent.vercel.app`.

Test from a terminal (this WILL call your phone):

```bash
curl -X POST https://YOUR-DEPLOYMENT.vercel.app/api/trigger \
  -H "X-Trigger-Secret: YOUR_SECRET"
```

Answer, press 1, and the calls stop. Ignore it, and it should call ~15 times
then text you.

### 4. Your iPhone (~7 min)

**a) The "Pango" contact — this is what makes the caller ID say Pango:**

1. Create a new contact named **Pango**, phone = your Twilio number.
2. Open the contact → Edit → **Ringtone → Emergency Bypass → ON** (and the same
   under Text Tone). This makes Pango ring **even in Silent mode, Do Not
   Disturb, and Driving Focus** — critical, since you'll be driving when it calls.

**b) The geofence automation:**

1. Shortcuts app → **Automation** tab → **+** → **When I Leave**.
2. Choose **Location** → search your parents' address → drag the radius circle
   as large as it allows (Shortcuts maxes out around 0.5 mi — the bigger the
   circle, the further away you are when the calls start).
3. Select **Run Immediately** (iOS 17+; otherwise it asks for a tap first).
4. Add action: **Get Contents of URL** and configure:
   - URL: `https://YOUR-DEPLOYMENT.vercel.app/api/trigger`
   - Method: **POST**
   - Headers: `X-Trigger-Secret` = your secret
5. Done. Every time your phone exits that circle, the calls begin.

**c) Optional kill-switch shortcut:**

Create a regular shortcut named "Stop Pango Calls" with the same
**Get Contents of URL** action pointed at `/api/stop`. Add it to your Home
Screen. One tap ends an active call loop (e.g. you already stopped parking
before leaving).

## Cost

| Item | Cost |
|---|---|
| Twilio phone number | ~$1.15/mo |
| Each reminder call | ~$0.014/min (a full 15-call storm ≈ $0.30) |
| Fallback SMS | ~$0.008 |
| Vercel + Upstash | free tier |

Typical month (a few visits, answering on call 1–2): **under $2.**

## Tuning

Set these env vars in Vercel and redeploy to change behavior: `MAX_ATTEMPTS`,
`RING_TIMEOUT_SECONDS`, `CALL_MESSAGE`, `SMS_MESSAGE` (see `.env.example`).

## Limitations (known and accepted)

- **It can't turn Pango off for you** — Pango has no public API. The agent
  nags; you still tap "stop parking" in the Pango app.
- It calls on **every** exit from the geofence, even visits where you didn't
  park with Pango (your choice — use the kill-switch shortcut on those days).
- True carrier-level caller-ID name isn't reliably settable in the US; the
  saved **Pango contact** is what makes the name appear.
- iOS location automations require the Shortcuts app to have location
  permission set to **Always** (Settings → Privacy → Location Services →
  Shortcuts).
