import type { AgentDefinition } from "@hoshmand/core";
import { EmailAgent } from "./email/emailAgent.js";
import { CalendarAgent } from "./calendar/calendarAgent.js";
import { SocialAgent } from "./social/socialAgent.js";
import { GymAgent } from "./gym/gymAgent.js";
import { CoordinatorAgent } from "./coordinator/coordinatorAgent.js";
import { CustomAgent } from "./custom/customAgent.js";

/**
 * The agent team. To add a new agent: instantiate a CustomAgent with a task,
 * or subclass BaseAgent for one that needs real tools, and list it here.
 * The coordinator always runs last.
 */
export const agents: AgentDefinition[] = [
  new EmailAgent(),
  new CalendarAgent(),
  new SocialAgent(),
  new GymAgent(),
  // Example of "add an agent, give it a task":
  // new CustomAgent("news", "Daily AI-industry scan", "Summarize what matters today in agentic AI for a founder building personal-agent products."),
  new CoordinatorAgent(),
];

export function findAgent(name: string): AgentDefinition | undefined {
  return agents.find((a) => a.name === name);
}

export { CustomAgent };
