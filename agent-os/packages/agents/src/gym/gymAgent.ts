import { BaseAgent, type AgentContext, type Store } from "@hoshmand/core";

/**
 * Gym agent — v2 scope, pending Sediq's spec of what it should do.
 * Likely: maintain a training program, log workouts, adjust plans based on
 * progress, schedule sessions via the calendar agent, and nudge on missed days.
 */
export class GymAgent extends BaseAgent {
  readonly name = "gym";
  readonly description = "Training programs, workout logging, and scheduling. (Not yet implemented.)";

  async execute(_ctx: AgentContext, _store: Store) {
    return {
      summary: "Gym agent not yet implemented — awaiting requirements.",
      pendingApprovals: 0,
    };
  }
}
