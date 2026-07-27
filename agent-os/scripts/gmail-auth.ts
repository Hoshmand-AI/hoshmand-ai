import "dotenv/config";
import http from "http";
import { google } from "googleapis";

// One-time per Gmail account: prints an auth URL, catches the OAuth redirect
// on localhost:3131, and prints the refresh token to paste into .env.
// Prereq: a Google Cloud OAuth client (Desktop or Web with this redirect URI)
// with the Gmail API enabled, and GOOGLE_CLIENT_ID/SECRET set in .env.
const REDIRECT_URI = "http://localhost:3131/oauth2callback";
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
];

async function main() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first.");
    process.exit(1);
  }

  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("\n1. Open this URL in the browser, signed in to the Gmail account to connect:\n");
  console.log(url);
  console.log("\n2. Approve access. Waiting for the redirect on http://localhost:3131 ...\n");

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url ?? "/", "http://localhost:3131");
      const c = u.searchParams.get("code");
      res.end(c ? "Done — return to the terminal." : "No code in request.");
      if (c) {
        server.close();
        resolve(c);
      }
    });
    server.on("error", reject);
    server.listen(3131);
  });

  const { tokens } = await auth.getToken(code);
  if (!tokens.refresh_token) {
    console.error("No refresh token returned — remove the app's prior grant at myaccount.google.com/permissions and retry.");
    process.exit(1);
  }
  console.log("\nRefresh token (add to .env as GMAIL_<ACCOUNT>_REFRESH_TOKEN):\n");
  console.log(tokens.refresh_token);
}

main();
