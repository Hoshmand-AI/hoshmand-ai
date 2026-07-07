// Smoke test: drives the compiled handlers end-to-end with all network
// layers stubbed — Twilio (axios adapter), Upstash Redis + QStash + Google
// OAuth + Gmail (global fetch). Twilio webhook signatures are real.
process.env.TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
process.env.TWILIO_AUTH_TOKEN = "test_auth_token_123";
process.env.TWILIO_PHONE_NUMBER = "+17035550100";
process.env.USER_PHONE_NUMBER = "+17035550199";
process.env.TRIGGER_SECRET = "s3cret";
process.env.UPSTASH_REDIS_REST_URL = "https://fake-upstash.local";
process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
process.env.QSTASH_TOKEN = "fake-qstash-token";
process.env.GOOGLE_CLIENT_ID = "fake-client-id";
process.env.GOOGLE_CLIENT_SECRET = "fake-client-secret";
process.env.GOOGLE_REFRESH_TOKEN = "fake-refresh-token";

const assert = require("assert");

// ---- stub state ----
const kv = new Map();
const gmail = {
  latestEventSnippet: "Parking activation, Plate: ABC1234", // newest Pango event email
  hasDeactivationSince: false, // result of the "Parking deactivation after:X" search
  down: false, // simulate Gmail/Google outage
};
const qstashPublishes = [];

// ---- Upstash Redis stub ----
function execCommand(cmd) {
  const op = String(cmd[0]).toLowerCase();
  if (op === "set") {
    kv.set(cmd[1], String(cmd[2]));
    return "OK";
  }
  if (op === "get") return kv.has(cmd[1]) ? kv.get(cmd[1]) : null;
  throw new Error("unhandled redis command: " + JSON.stringify(cmd));
}

// ---- fetch router: Redis / OAuth / Gmail / QStash ----
globalThis.fetch = async (input, opts = {}) => {
  const url = String(input);
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

  if (url.startsWith("https://fake-upstash.local")) {
    const body = JSON.parse(opts.body);
    const isPipeline = Array.isArray(body[0]);
    return json(isPipeline ? body.map((c) => ({ result: execCommand(c) })) : { result: execCommand(body) });
  }
  if (url.startsWith("https://oauth2.googleapis.com/token")) {
    if (gmail.down) return json({ error: "backend_error" }, 500);
    return json({ access_token: "fake-access-token" });
  }
  if (url.startsWith("https://gmail.googleapis.com/gmail/v1/users/me/messages?")) {
    const q = decodeURIComponent(new URL(url).searchParams.get("q"));
    if (q.includes('"Parking deactivation"') && q.includes("after:")) {
      return json({ messages: gmail.hasDeactivationSince ? [{ id: "m-deact" }] : undefined });
    }
    return json({ messages: [{ id: "m-latest" }] }); // arming search (activation OR deactivation)
  }
  if (url.startsWith("https://gmail.googleapis.com/gmail/v1/users/me/messages/")) {
    return json({ snippet: gmail.latestEventSnippet, internalDate: "1751800000000" });
  }
  if (url.startsWith("https://qstash.upstash.io/v2/publish/")) {
    qstashPublishes.push({
      dest: url.slice("https://qstash.upstash.io/v2/publish/".length),
      delay: opts.headers["Upstash-Delay"],
    });
    return json({ messageId: "msg_" + qstashPublishes.length });
  }
  throw new Error("unexpected fetch: " + url);
};

// ---- Twilio HTTP stub (axios adapter) ----
const axios = require("axios");
const twilioRequests = [];
axios.defaults.adapter = async (config) => {
  twilioRequests.push({ url: config.url, data: config.data });
  const data = config.url.includes("/Calls.json")
    ? { sid: "CA" + twilioRequests.length, status: "queued" }
    : { sid: "SM" + twilioRequests.length, status: "queued" };
  return { data, status: 201, statusText: "Created", headers: {}, config };
};

// ---- fake Vercel req/res ----
function makeReq({ method = "POST", url, headers = {}, query = {}, body = {} }) {
  return { method, url, headers: { host: "example.com", ...headers }, query, body };
}
function makeRes() {
  const res = {
    statusCode: null,
    jsonBody: null,
    sent: null,
    headers: {},
    setHeader(k, v) { res.headers[k] = v; },
    status(code) { res.statusCode = code; return res; },
    json(obj) { res.jsonBody = obj; return res; },
    send(x) { res.sent = x; return res; },
  };
  return res;
}

const twilioSdk = require("twilio");
function signed(url, params) {
  return twilioSdk.getExpectedTwilioSignature(process.env.TWILIO_AUTH_TOKEN, url, params);
}
function session() {
  return JSON.parse(kv.get("pango:session"));
}
function setSession(s) {
  kv.set("pango:session", JSON.stringify(s));
}

(async () => {
  const trigger = require("../.test-dist/api/trigger").default;
  const voice = require("../.test-dist/api/voice").default;
  const gather = require("../.test-dist/api/gather").default;
  const callStatus = require("../.test-dist/api/call-status").default;
  const verify = require("../.test-dist/api/verify").default;
  const stop = require("../.test-dist/api/stop").default;
  const statusEp = require("../.test-dist/api/status").default;

  const auth = { "x-trigger-secret": "s3cret" };

  // 1. trigger without secret -> 401, nothing happens
  let res = makeRes();
  await trigger(makeReq({ url: "/api/trigger" }), res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(twilioRequests.length, 0);

  // 2. smart arming: newest Pango email is a DEACTIVATION -> no call
  gmail.latestEventSnippet = "Parking deactivation, Plate: ABC1234";
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: auth }), res);
  assert.strictEqual(res.jsonBody.started, false);
  assert.ok(res.jsonBody.reason.includes("no active Pango session"));
  assert.strictEqual(twilioRequests.length, 0);
  assert.ok(!kv.has("pango:session"));

  // 3. newest email is an ACTIVATION -> session created, call placed
  gmail.latestEventSnippet = "Parking activation, Plate: ABC1234";
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: auth }), res);
  assert.strictEqual(res.jsonBody.started, true);
  assert.strictEqual(twilioRequests.length, 1);
  const callParams = new URLSearchParams(twilioRequests[0].data);
  assert.strictEqual(callParams.get("To"), "+17035550199");
  assert.strictEqual(callParams.get("Url"), "https://example.com/api/voice");
  assert.deepStrictEqual([session().cycle, session().attempts, session().phase], [1, 1, "calling"]);

  // 4. duplicate trigger while loop active -> not restarted
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: auth }), res);
  assert.strictEqual(res.jsonBody.started, false);
  assert.strictEqual(twilioRequests.length, 1);

  // 5. voice with bad signature -> 403
  res = makeRes();
  await voice(makeReq({ url: "/api/voice", headers: { "x-twilio-signature": "bogus" } }), res);
  assert.strictEqual(res.statusCode, 403);

  // 6. voice with valid signature -> TwiML with Gather
  const voiceParams = { CallSid: "CA1", From: "+17035550100" };
  res = makeRes();
  await voice(makeReq({
    url: "/api/voice",
    headers: { "x-twilio-signature": signed("https://example.com/api/voice", voiceParams) },
    body: voiceParams,
  }), res);
  assert.ok(res.sent.includes("<Gather"));
  assert.ok(res.sent.includes("Pango"));

  // 7. call ends unanswered -> immediate redial, attempt 2
  let statusParams = { CallSid: "CA1", CallStatus: "no-answer" };
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=1",
    headers: { "x-twilio-signature": signed("https://example.com/api/call-status?attempt=1", statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.redialed, true);
  assert.strictEqual(res.jsonBody.attempt, 2);
  assert.strictEqual(twilioRequests.length, 2);

  // 8. user presses 1 -> verify scheduled via QStash, phase=verifying
  const gatherParams = { CallSid: "CA2", Digits: "1" };
  res = makeRes();
  await gather(makeReq({
    url: "/api/gather",
    headers: { "x-twilio-signature": signed("https://example.com/api/gather", gatherParams) },
    body: gatherParams,
  }), res);
  assert.ok(res.sent.includes("check your email"));
  assert.ok(res.sent.includes("<Hangup"));
  assert.strictEqual(qstashPublishes.length, 1);
  assert.strictEqual(qstashPublishes[0].delay, "300s");
  assert.ok(qstashPublishes[0].dest.startsWith("https://example.com/api/verify?secret="));
  assert.strictEqual(session().phase, "verifying");

  // 9. that call's status callback arrives -> no redial while verifying
  statusParams = { CallSid: "CA2", CallStatus: "completed" };
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=2",
    headers: { "x-twilio-signature": signed("https://example.com/api/call-status?attempt=2", statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.done, true);
  assert.strictEqual(twilioRequests.length, 2);

  // 10. verify fires, deactivation email NOT found -> cycle 2 calls start
  gmail.hasDeactivationSince = false;
  res = makeRes();
  await verify(makeReq({ url: "/api/verify?secret=s3cret", query: { secret: "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.recalling, true);
  assert.strictEqual(res.jsonBody.cycle, 2);
  assert.strictEqual(twilioRequests.length, 3);
  assert.deepStrictEqual([session().cycle, session().attempts, session().phase], [2, 1, "calling"]);

  // 11. press 1 again, then verify finds the deactivation email -> verified, done
  res = makeRes();
  await gather(makeReq({
    url: "/api/gather",
    headers: { "x-twilio-signature": signed("https://example.com/api/gather", gatherParams) },
    body: gatherParams,
  }), res);
  assert.strictEqual(session().phase, "verifying");
  gmail.hasDeactivationSince = true;
  res = makeRes();
  await verify(makeReq({ url: "/api/verify?secret=s3cret", query: { secret: "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.reason, "verified");
  assert.strictEqual(session().endedReason, "verified");
  assert.strictEqual(twilioRequests.length, 3);

  // 12. status endpoint reflects the verified session
  res = makeRes();
  await statusEp(makeReq({ method: "GET", url: "/api/status", headers: auth }), res);
  assert.strictEqual(res.jsonBody.session.endedReason, "verified");

  // 13. verify at final cycle with no deactivation -> fallback SMS, give up
  setSession({ id: "t1", cycle: 3, attempts: 1, phase: "verifying", startedAt: new Date().toISOString() });
  gmail.hasDeactivationSince = false;
  res = makeRes();
  await verify(makeReq({ url: "/api/verify?secret=s3cret", query: { secret: "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.reason, "max_cycles");
  assert.strictEqual(res.jsonBody.smsSent, true);
  assert.ok(twilioRequests[3].url.includes("/Messages.json"));

  // 14. max call attempts within a cycle -> fallback SMS, give up
  setSession({ id: "t2", cycle: 1, attempts: 15, phase: "calling", startedAt: new Date().toISOString() });
  statusParams = { CallSid: "CA99", CallStatus: "no-answer" };
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=15",
    headers: { "x-twilio-signature": signed("https://example.com/api/call-status?attempt=15", statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.reason, "max_attempts");
  assert.strictEqual(res.jsonBody.smsSent, true);

  // 15. Gmail outage at trigger time -> fail toward calling
  kv.delete("pango:session");
  gmail.down = true;
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: auth }), res);
  assert.strictEqual(res.jsonBody.started, true);
  assert.ok(res.jsonBody.gmailNote.includes("calling to be safe"));
  gmail.down = false;

  // 16. stop endpoint kills the active loop
  res = makeRes();
  await stop(makeReq({ url: "/api/stop", headers: auth }), res);
  assert.strictEqual(res.jsonBody.stopped, true);
  assert.strictEqual(session().endedReason, "stopped");

  console.log("ALL 16 SMOKE TESTS PASSED");
})().catch((e) => { console.error("TEST FAILED:", e); process.exit(1); });
