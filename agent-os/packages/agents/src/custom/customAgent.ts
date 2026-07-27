import { BaseAgent, prose, type AgentContext, type Store } from "@hoshmand/core";

/**
 * The extensibility primitive: "add an agent and give it a task".
 * A CustomAgent has a name and standing instructions; each run it produces a
 * report (and can be upgraded later with tools). Define new ones in registry.ts.
 */
export class CustomAgent extends BaseAgent {
  constructor(
    readonly name: string,
    readonly description: string,
    private readonly instructions: string,
  ) {
    super();
  }

  async execute(ctx: AgentContext, _store: Store) {
    const report = await prose({
      agent: this.name,
      system:
        `You are a personal agent named "${self(this.name)}" working for Sediq (Hoshmand AI). ` +
        `Your standing task:\n${this.instructions}\n` +
        `Produce today's actionable report in Markdown. Be concise and concrete.`,
      prompt: `Today is ${ctx.now.toISOString().slice(0, 10)}. Produce your report.`,
    });
    return {
      summary: report.length > 300 ? `${report.slice(0, 297)}...` : report,
      details: { report },
      pendingApprovals: 0,
    };
  }
}

function self(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
