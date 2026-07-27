import "dotenv/config";
import path from "path";
import { agents, findAgent } from "@hoshmand/agents";
import type { AgentContext } from "@hoshmand/core";

// Usage:
//   npm run agent -- all          run the whole team (coordinator last)
//   npm run agent -- email        run one agent
//   npm run agent -- list         show the team
async function main() {
  const target = process.argv[2] ?? "list";
  const ctx: AgentContext = {
    dataDir: process.env.AGENT_DATA_DIR ?? path.resolve(".data"),
    now: new Date(),
  };

  if (target === "list") {
    console.log("Agent team:");
    for (const a of agents) console.log(`  ${a.name.padEnd(12)} ${a.description}`);
    return;
  }

  const toRun = target === "all" ? agents : [findAgent(target)].filter((a) => a !== undefined);
  if (toRun.length === 0) {
    console.error(`Unknown agent "${target}". Try: npm run agent -- list`);
    process.exitCode = 1;
    return;
  }

  for (const agent of toRun) {
    console.log(`\n=== ${agent.name} ===`);
    try {
      const result = await agent.run(ctx);
      console.log(result.summary);
    } catch (err) {
      console.error(`[${agent.name}] failed:`, err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }
}

main();
