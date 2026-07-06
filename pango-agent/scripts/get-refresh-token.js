#!/usr/bin/env node
// One-time helper: obtains a Gmail read-only OAuth refresh token.
//
// Usage (run on your own computer, needs Node 18+):
//   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/get-refresh-token.js
//
// Opens a Google consent URL; after you approve, it prints the
// GOOGLE_REFRESH_TOKEN value to paste into Vercel.

const http = require("http");

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars first.");
  process.exit(1);
}

const PORT = 53682;
const redirectUri = `http://localhost:${PORT}`;
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
  }).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("No ?code in request.");
    return;
  }
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const data = await tokenRes.json();
    if (!data.refresh_token) throw new Error(JSON.stringify(data));
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Success! Refresh token printed in your terminal. You can close this tab.");
    console.log("\nAdd this to your Vercel environment variables:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}\n`);
  } catch (err) {
    res.writeHead(500).end("Token exchange failed — see terminal.");
    console.error("Token exchange failed:", err);
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("1. Open this URL in your browser and approve access:\n");
  console.log(authUrl + "\n");
  console.log("   (If Google warns the app is unverified: Advanced -> Go to <app name>.)");
  console.log("2. Wait for the redirect back to localhost — the token prints here.\n");
});
