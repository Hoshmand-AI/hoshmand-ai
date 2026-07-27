import { z } from "zod";

export const TriageItemSchema = z.object({
  emailId: z.string(),
  category: z.enum(["urgent", "needs_reply", "fyi", "newsletter", "promotional", "other"]),
  reason: z.string(),
  needsReply: z.boolean(),
  /** Plain-text reply draft when needsReply is true; empty string otherwise. */
  draftReply: z.string(),
});

export const TriageBatchSchema = z.object({
  items: z.array(TriageItemSchema),
  /** 2-3 sentence overview of this inbox for the daily brief. */
  inboxSummary: z.string(),
});

export type TriageBatch = z.infer<typeof TriageBatchSchema>;
