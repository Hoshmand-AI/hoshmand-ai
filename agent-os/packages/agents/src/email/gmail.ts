import { google, gmail_v1 } from "googleapis";

export interface GmailAccountConfig {
  id: string;
  address: string;
  refreshToken: string;
}

export interface InboxEmail {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
}

/** Thin wrapper over the official Gmail API for one account. */
export class GmailAccount {
  private readonly gmail: gmail_v1.Gmail;
  private labelCache = new Map<string, string>();

  constructor(readonly config: GmailAccountConfig) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    auth.setCredentials({ refresh_token: config.refreshToken });
    this.gmail = google.gmail({ version: "v1", auth });
  }

  async listUnread(max: number): Promise<InboxEmail[]> {
    const list = await this.gmail.users.messages.list({
      userId: "me",
      q: "is:unread in:inbox",
      maxResults: max,
    });
    const out: InboxEmail[] = [];
    for (const ref of list.data.messages ?? []) {
      const msg = await this.gmail.users.messages.get({
        userId: "me",
        id: ref.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });
      const headers = msg.data.payload?.headers ?? [];
      const h = (name: string) =>
        headers.find((x) => x.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
      out.push({
        id: ref.id!,
        threadId: msg.data.threadId ?? ref.id!,
        from: h("From"),
        subject: h("Subject"),
        date: h("Date"),
        snippet: msg.data.snippet ?? "",
      });
    }
    return out;
  }

  private async labelId(name: string): Promise<string> {
    const cached = this.labelCache.get(name);
    if (cached) return cached;
    const labels = await this.gmail.users.labels.list({ userId: "me" });
    const existing = labels.data.labels?.find((l) => l.name === name);
    if (existing?.id) {
      this.labelCache.set(name, existing.id);
      return existing.id;
    }
    const created = await this.gmail.users.labels.create({
      userId: "me",
      requestBody: { name, labelListVisibility: "labelShow", messageListVisibility: "show" },
    });
    this.labelCache.set(name, created.data.id!);
    return created.data.id!;
  }

  async applyLabel(messageId: string, labelName: string): Promise<void> {
    const id = await this.labelId(labelName);
    await this.gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: { addLabelIds: [id] },
    });
  }

  /** Human-in-the-loop: agent drafts, human reviews and hits send in Gmail. */
  async createDraftReply(email: InboxEmail, body: string): Promise<void> {
    const to = email.from;
    const subject = email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`;
    const raw = Buffer.from(
      [`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/plain; charset=utf-8", "", body].join(
        "\r\n",
      ),
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    await this.gmail.users.drafts.create({
      userId: "me",
      requestBody: { message: { raw, threadId: email.threadId } },
    });
  }
}

export function accountsFromEnv(): GmailAccountConfig[] {
  const ids = (process.env.GMAIL_ACCOUNTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const configs: GmailAccountConfig[] = [];
  for (const id of ids) {
    const key = id.toUpperCase();
    const refreshToken = process.env[`GMAIL_${key}_REFRESH_TOKEN`];
    const address = process.env[`GMAIL_${key}_ADDRESS`] ?? id;
    if (!refreshToken) {
      console.warn(`[email] skipping account "${id}" — GMAIL_${key}_REFRESH_TOKEN not set`);
      continue;
    }
    configs.push({ id, address, refreshToken });
  }
  return configs;
}
