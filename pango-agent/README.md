# Pango Reminder Agent 📞

When you drive ~0.5 miles away from your parents' house **while a Pango
parking session is running**, this agent calls your phone **back to back**
(caller shows as **"Pango"**) until you press **1**. Five minutes later it
checks your Gmail for Pango's *"Parking deactivation"* receipt — if you got
distracted and never actually stopped the session, the calls start again
(up to 3 cycles), then it falls back to an SMS.

## How it works

```
iPhone leaves geofence
  └─ iOS Shortcuts automation fires a webhook ──► POST /api/trigger
       └─ Gmail check: is a Pango session active?
            ├─ No (latest email = deactivation) ──► stay silent, no calls
            └─ Yes ──► Twilio calls your phone ("Pango" rings)
                 ├─ Voicemail / no answer / ignored ──► redials immediately
                 ├─ 15 unconfirmed calls ──► fallback SMS, give up
                 └─ You press 1 ──► calls pause
                      └─ 5 min later: Gmail has "Parking deactivation"?
                           ├─ Yes ──► verified, done ✅
                           ├─ No ──► new cycle of back-to-back calls (max 3 cycles)
                           └─ 3 cycles exhausted ──► fallback SMS, give up
```

Key design points:

- **Pango has no public API**, but it emails a receipt within ~1 minute of
  every session start ("Parking activation") and stop ("Parking
  deactivation"). Your inbox is the source of truth: it decides both
  *whether to call at all* and *whether you really stopped the session*.
- Gmail access is **read-only** (OAuth `gmail.readonly` scope) and only ever
  searches for `mypango.com` emails.
- If Gmail is unreachable when you leave, the agent **calls anyway** — a
  spurious reminder is cheaper than a night of parking charges.
- Voicemail picking up does **not** count as answering — only pressing 1 does.
- Upstash Redis stores loop state; QStash delivers the delayed 5-minute
  verification check (serverless functions can't sleep).

## Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /api/trigger` | `X-Trigger-Secret` header | Geofence webhook: check Gmail, maybe start calling |
| `POST /api/verify` | secret in query (from QStash) | The 5-minute "did he really stop it?" check |
| `POST /api/stop` | `X-Trigger-Secret` header | Kill switch — stop an active loop |
| `GET /api/status` | `X-Trigger-Secret` header | Inspect current/last session |
| `POST /api/voice` | Twilio signature | TwiML the caller hears |
| `POST /api/gather` | Twilio signature | Handles the "press 1" keypress |
| `POST /api/call-status` | Twilio signature | End-of-call callback; drives the redial loop |

## Setup (one time, ~45 minutes)

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

### 2. Upstash: Redis + QStash (~5 min, free)

1. Sign up at [console.upstash.com](https://console.upstash.com).
2. Create a **Redis** database (free tier, `us-east-1`). Note the **REST URL**
   and **REST Token**.
3. Open the **QStash** tab in the same console and note the **QSTASH_TOKEN**.

### 3. Google OAuth for Gmail (~15 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create
   a project (e.g. `pango-agent`).
2. **APIs & Services → Library** → search **Gmail API** → Enable.
3. **APIs & Services → OAuth consent screen**: External, app name
   `pango-agent`, your email everywhere. Add yourself as a test user.
4. **Publish the app** (set status to "In production"). This matters: while
   the app stays in "Testing", refresh tokens expire every 7 days and the
   agent would silently lose Gmail access.
5. **Credentials → Create Credentials → OAuth client ID → Desktop app**.
   Note the **Client ID** and **Client Secret**.
6. On your own computer (Node 18+), run:

   ```bash
   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/get-refresh-token.js
   ```

   Open the printed URL, approve access (if Google warns "unverified app":
   Advanced → Go to pango-agent), and copy the printed `GOOGLE_REFRESH_TOKEN`.

### 4. Deploy to Vercel (~5 min)

1. In [vercel.com](https://vercel.com) → **Add New → Project** → import this
   GitHub repo (`Hoshmand-AI/hoshmand-ai`).
2. **Set "Root Directory" to `pango-agent`** — this makes it a separate project
   from the main website.
3. Add the environment variables from `.env.example` (all the non-optional ones).
   Generate `TRIGGER_SECRET` with `openssl rand -hex 24` or any long random string.
4. Deploy. Note your deployment URL, e.g. `https://pango-agent.vercel.app`.

Test from a terminal:

```bash
curl -X POST https://YOUR-DEPLOYMENT.vercel.app/api/trigger \
  -H "X-Trigger-Secret: YOUR_SECRET"
```

With no active Pango session it should answer
`{"started":false,"reason":"no active Pango session in Gmail"}`. Start a real
Pango session (or wait for your next visit) and it WILL call your phone;
press 1, don't stop the session, and 5 minutes later it calls again — that's
the verification loop working.

### 5. Your iPhone (~7 min)

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
5. Done. Exits without a running Pango session are silently ignored, so this
   can fire on every visit without bothering you.

**c) Optional kill-switch shortcut:**

Create a regular shortcut named "Stop Pango Calls" with the same
**Get Contents of URL** action pointed at `/api/stop`. Add it to your Home
Screen. One tap ends an active call loop.

## Cost

| Item | Cost |
|---|---|
| Twilio phone number | ~$1.15/mo |
| Each reminder call | ~$0.014/min (a full 15-call cycle ≈ $0.30) |
| Fallback SMS | ~$0.008 |
| Vercel + Upstash (Redis & QStash) + Gmail API | free tier |

Typical month (a few visits, answering on call 1–2): **under $2.**

## Tuning

Set these env vars in Vercel and redeploy to change behavior: `MAX_ATTEMPTS`,
`MAX_CYCLES`, `VERIFY_DELAY_SECONDS`, `RING_TIMEOUT_SECONDS`, `CALL_MESSAGE`,
`SMS_MESSAGE` (see `.env.example`).

## Tests

`npm test` compiles the handlers and runs 16 end-to-end smoke tests with all
external services (Twilio, Redis, QStash, Google OAuth, Gmail) stubbed at the
network layer — including real Twilio webhook signature validation.

## Limitations (known and accepted)

- **It can't turn Pango off for you** — Pango has no public API. The agent
  nags and verifies; you still tap "stop parking" in the Pango app.
- Everything hinges on Pango's receipt emails arriving promptly (historically
  ~1 minute). If an *activation* email goes missing, the agent thinks no
  session is running and stays silent; if a *deactivation* email is delayed
  past the 5-minute check, you'll get one extra round of calls after already
  stopping. Press 1 again and it re-verifies.
- The Gmail account checked must be the one your Pango receipts go to
  (sediq.ne@gmail.com).
- True carrier-level caller-ID name isn't reliably settable in the US; the
  saved **Pango contact** is what makes the name appear.
- iOS location automations require the Shortcuts app to have location
  permission set to **Always** (Settings → Privacy → Location Services →
  Shortcuts).
