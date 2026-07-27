import { BaseAgent, prose, type AgentContext, type AgentResult, type Store } from "@hoshmand/core";

const SYSTEM = `You are the chief-of-staff agent for Sediq, founder of Hoshmand AI.
You receive today's reports from his other agents (email, calendar, social, gym, ...)
and compose one morning brief in Markdown. Lead with what needs his attention today
(urgent emails, pending draft approvals), then a short section per agent. Be concise:
the whole brief should be readable in under two minutes. Plain language, no filler.`;

/** Runs last: merges every other agent's output into one daily brief. */
export class CoordinatorAgent extends BaseAgent {
  readonly name = "coordinator";
  readonly description = "Merge all agent reports into a single daily brief.";

  async execute(ctx: AgentContext, store: Store) {
    const day = ctx.now.toISOString().slice(0, 10);
    const files = await store.list(`results/${day}`);
    const reports: AgentResult[] = [];
    for (const f of files) {
      if (f === "coordinator.json") continue;
      const r = await store.readJson<AgentResult>(`results/${day}/${f}`);
      if (r) reports.push(r);
    }

    if (reports.length === 0) {
      return {
        summary: "No agent reports found for today — run the other agents first.",
        pendingApprovals: 0,
      };
    }

    const brief = await prose({
      agent: this.name,
      system: SYSTEM,
      prompt: `Today is ${day}. Compose the morning brief from these agent reports:\n\n${JSON.stringify(reports, null, 2)}`,
    });

    await store.writeText(`briefs/${day}.md`, brief);
    const pending = reports.reduce((n, r) => n + r.pendingApprovals, 0);
    return {
      summary: `Daily brief written to briefs/${day}.md (${reports.length} agent reports, ${pending} items awaiting approval).`,
      details: { briefPath: `briefs/${day}.md` },
      pendingApprovals: pending,
    };
  }
}
