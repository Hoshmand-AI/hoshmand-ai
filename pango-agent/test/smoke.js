// Smoke test: drives the compiled handlers end-to-end with the Twilio HTTP
// layer (axios adapter) and Upstash REST layer (global fetch) stubbed.
process.env.TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
process.env.TWILIO_AUTH_TOKEN = "test_auth_token_123";
process.env.TWILIO_PHONE_NUMBER = "+17035550100";
process.env.USER_PHONE_NUMBER = "+17035550199";
process.env.TRIGGER_SECRET = "s3cret";
process.env.UPSTASH_REDIS_REST_URL = "https://fake-upstash.local";
process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";

const assert = require("assert");

// ---- Upstash stub (in-memory) ----
const kv = new Map();
function execCommand(cmd) {
  const op = String(cmd[0]).toLowerCase();
  if (op === "set") {
    kv.set(cmd[1], String(cmd[2]));
    return "OK";
  }
  if (op === "get") {
    return kv.has(cmd[1]) ? kv.get(cmd[1]) : null;
  }
  throw new Error("unhandled redis command: " + JSON.stringify(cmd));
}
globalThis.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  const isPipeline = Array.isArray(body[0]);
  const payload = isPipeline
    ? body.map((c) => ({ result: execCommand(c) }))
    : { result: execCommand(body) };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
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
  return twilioSdk.getExpectedTwilioSignature(
    process.env.TWILIO_AUTH_TOKEN, url, params
  );
}

(async () => {
  const trigger = require("../.test-dist/api/trigger").default;
  const voice = require("../.test-dist/api/voice").default;
  const gather = require("../.test-dist/api/gather").default;
  const callStatus = require("../.test-dist/api/call-status").default;
  const stop = require("../.test-dist/api/stop").default;
  const statusEp = require("../.test-dist/api/status").default;

  // 1. trigger without secret -> 401, no call placed
  let res = makeRes();
  await trigger(makeReq({ url: "/api/trigger" }), res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(twilioRequests.length, 0);

  // 2. trigger with secret -> session created, call placed
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: { "x-trigger-secret": "s3cret" } }), res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.jsonBody.started, true);
  assert.strictEqual(twilioRequests.length, 1);
  assert.ok(twilioRequests[0].url.includes("/Calls.json"));
  const callParams = new URLSearchParams(twilioRequests[0].data);
  assert.strictEqual(callParams.get("To"), "+17035550199");
  assert.strictEqual(callParams.get("From"), "+17035550100");
  assert.strictEqual(callParams.get("Url"), "https://example.com/api/voice");
  assert.strictEqual(callParams.get("StatusCallback"), "https://example.com/api/call-status?attempt=1");
  assert.strictEqual(callParams.get("Timeout"), "25");

  // 3. duplicate trigger while loop active -> not restarted
  res = makeRes();
  await trigger(makeReq({ url: "/api/trigger", headers: { "x-trigger-secret": "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.started, false);
  assert.strictEqual(twilioRequests.length, 1);

  // 4. voice with bad signature -> 403
  res = makeRes();
  await voice(makeReq({ url: "/api/voice", headers: { "x-twilio-signature": "bogus" } }), res);
  assert.strictEqual(res.statusCode, 403);

  // 5. voice with valid signature -> TwiML with Gather + message
  const voiceUrl = "https://example.com/api/voice";
  const voiceParams = { CallSid: "CA1", From: "+17035550100" };
  res = makeRes();
  await voice(makeReq({
    url: "/api/voice",
    headers: { "x-twilio-signature": signed(voiceUrl, voiceParams) },
    body: voiceParams,
  }), res);
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.sent.includes("<Gather"));
  assert.ok(res.sent.includes("Pango"));
  assert.ok(res.sent.includes('action="/api/gather"'));

  // 6. call ends unanswered -> immediate redial, attempt 2
  const statusUrl = "https://example.com/api/call-status?attempt=1";
  let statusParams = { CallSid: "CA1", CallStatus: "no-answer" };
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=1",
    headers: { "x-twilio-signature": signed(statusUrl, statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.redialed, true);
  assert.strictEqual(res.jsonBody.attempt, 2);
  assert.strictEqual(twilioRequests.length, 2);

  // 7. user presses 1 -> confirmed
  const gatherUrl = "https://example.com/api/gather";
  const gatherParams = { CallSid: "CA2", Digits: "1" };
  res = makeRes();
  await gather(makeReq({
    url: "/api/gather",
    headers: { "x-twilio-signature": signed(gatherUrl, gatherParams) },
    body: gatherParams,
  }), res);
  assert.ok(res.sent.includes("Confirmed"));
  assert.ok(res.sent.includes("<Hangup"));

  // 8. that call's status callback arrives -> no redial
  statusParams = { CallSid: "CA2", CallStatus: "completed" };
  const statusUrl2 = "https://example.com/api/call-status?attempt=2";
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=2",
    headers: { "x-twilio-signature": signed(statusUrl2, statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.done, true);
  assert.strictEqual(res.jsonBody.reason, "confirmed");
  assert.strictEqual(twilioRequests.length, 2);

  // 9. status endpoint reflects the confirmed session
  res = makeRes();
  await statusEp(makeReq({ method: "GET", url: "/api/status", headers: { "x-trigger-secret": "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.session.endedReason, "confirmed");

  // 10. max-attempts path -> fallback SMS, loop ends
  kv.set("pango:session", JSON.stringify({
    id: "test", attempts: 15, confirmed: false, startedAt: new Date().toISOString(),
  }));
  statusParams = { CallSid: "CA15", CallStatus: "no-answer" };
  const statusUrl15 = "https://example.com/api/call-status?attempt=15";
  res = makeRes();
  await callStatus(makeReq({
    url: "/api/call-status?attempt=15",
    headers: { "x-twilio-signature": signed(statusUrl15, statusParams) },
    body: statusParams,
  }), res);
  assert.strictEqual(res.jsonBody.reason, "max_attempts");
  assert.strictEqual(res.jsonBody.smsSent, true);
  assert.ok(twilioRequests[2].url.includes("/Messages.json"));
  const smsParams = new URLSearchParams(twilioRequests[2].data);
  assert.ok(smsParams.get("Body").includes("Pango"));

  // 11. stop endpoint kills an active loop
  kv.set("pango:session", JSON.stringify({
    id: "test2", attempts: 3, confirmed: false, startedAt: new Date().toISOString(),
  }));
  res = makeRes();
  await stop(makeReq({ url: "/api/stop", headers: { "x-trigger-secret": "s3cret" } }), res);
  assert.strictEqual(res.jsonBody.stopped, true);
  const after = JSON.parse(kv.get("pango:session"));
  assert.strictEqual(after.endedReason, "stopped");

  console.log("ALL 11 SMOKE TESTS PASSED");
})().catch((e) => { console.error("TEST FAILED:", e); process.exit(1); });
