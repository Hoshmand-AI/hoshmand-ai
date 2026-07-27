import type { AgentContext, AgentDefinition, AgentResult } from "./types.js";
import { Store } from "./store.js";

export abstract class BaseAgent implements AgentDefinition {
  abstract readonly name: string;
  abstract readonly description: string;

  abstract execute(ctx: AgentContext, store: Store): Promise<Omit<AgentResult, "agent" | "ranAt">>;

  async run(ctx: AgentContext): Promise<AgentResult> {
    const store = new Store(ctx.dataDir);
    const partial = await this.execute(ctx, store);
    const result: AgentResult = {
      agent: this.name,
      ranAt: ctx.now.toISOString(),
      ...partial,
    };
    // Each run drops its result where the coordinator can find today's outputs.
    const day = ctx.now.toISOString().slice(0, 10);
    await store.writeJson(`results/${day}/${this.name}.json`, result);
    return result;
  }

  protected log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }
}
