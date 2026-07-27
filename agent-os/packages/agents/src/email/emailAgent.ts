import { BaseAgent, structured, type AgentContext, type Store } from "@hoshmand/core";
import { GmailAccount, accountsFromEnv, type InboxEmail } from "./gmail.js";
import { TriageBatchSchema } from "./schemas.js";

const LABEL_BY_CATEGORY: Record<string, string> = {
  urgent: "AgentOS/Urgent",
  needs_reply: "AgentOS/Needs-Reply",
  fyi: "AgentOS/FYI",
  newsletter: "AgentOS/Newsletter",
  promotional: "AgentOS/Promotional",
  other: "AgentOS/Other",
};

const SYSTEM = `You triage a personal Gmail inbox for Sediq, founder of Hoshmand AI.
Classify each email, and for emails that genuinely need a reply, write a short draft
in Sediq's voice: warm, direct, concise, no filler. Never invent facts or commitments.
If a reply requires information you don't have, draft the reply with a [FILL IN: ...]
placeholder rather than guessing.`;

interface AccountReport {
  account: string;
  address: string;
  triaged: number;
  drafts: number;
  urgent: string[];
  inboxSummary: string;
}

export class EmailAgent extends BaseAgent {
  readonly name = "email";
  readonly description =
    "Triage unread email across all configured Gmail accounts: label, summarize, and draft replies for human review.";

  async execute(ctx: AgentContext, store: Store) {
    const configs = accountsFromEnv();
    if (configs.length === 0) {
      return {
        summary: "No Gmail accounts configured. Set GMAIL_ACCOUNTS and refresh tokens in .env.",
        pendingApprovals: 0,
      };
    }

    const batchSize = Number(process.env.EMAIL_TRIAGE_BATCH ?? 25);
    const reports: AccountReport[] = [];
    let totalDrafts = 0;

    for (const config of configs) {
      const account = new GmailAccount(config);
      const unread = await account.listUnread(batchSize);
      this.log(`${config.address}: ${unread.length} unread`);
      if (unread.length === 0) {
        reports.push({
          account: config.id,
          address: config.address,
          triaged: 0,
          drafts: 0,
          urgent: [],
          inboxSummary: "Inbox clear — no unread email.",
        });
        continue;
      }

      const triage = await structured({
        agent: this.name,
        system: SYSTEM,
        schema: TriageBatchSchema,
        prompt:
          `Triage these unread emails from the account ${config.address}. ` +
          `Return one item per email, keyed by emailId.\n\n` +
          JSON.stringify(unread, null, 2),
      });

      const byId = new Map<string, InboxEmail>(unread.map((e) => [e.id, e]));
      let drafts = 0;
      const urgent: string[] = [];

      for (const item of triage.items) {
        const email = byId.get(item.emailId);
        if (!email) continue;
        await account.applyLabel(email.id, LABEL_BY_CATEGORY[item.category] ?? "AgentOS/Other");
        if (item.category === "urgent") urgent.push(`${email.from}: ${email.subject}`);
        if (item.needsReply && item.draftReply.trim()) {
          // Draft-only: the human reviews and sends from Gmail. Nothing is auto-sent.
          await account.createDraftReply(email, item.draftReply);
          drafts++;
        }
      }

      totalDrafts += drafts;
      reports.push({
        account: config.id,
        address: config.address,
        triaged: triage.items.length,
        drafts,
        urgent,
        inboxSummary: triage.inboxSummary,
      });
    }

    const totalTriaged = reports.reduce((n, r) => n + r.triaged, 0);
    return {
      summary:
        `Triaged ${totalTriaged} emails across ${reports.length} account(s); ` +
        `created ${totalDrafts} reply draft(s) awaiting your review in Gmail.`,
      details: reports,
      pendingApprovals: totalDrafts,
    };
  }
}
