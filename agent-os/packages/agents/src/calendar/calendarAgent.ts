import { BaseAgent, type AgentContext, type Store } from "@hoshmand/core";

/**
 * Calendar agent — v2 scope.
 * Planned: read all Google Calendars, flag conflicts, protect focus time,
 * schedule gym sessions, and feed today's agenda into the daily brief.
 * Uses the official Google Calendar API with the same OAuth flow as Gmail.
 */
export class CalendarAgent extends BaseAgent {
  readonly name = "calendar";
  readonly description = "Manage calendars: agenda, conflicts, scheduling. (Not yet implemented.)";

  async execute(_ctx: AgentContext, _store: Store) {
    return {
      summary: "Calendar agent not yet implemented — planned for v2.",
      pendingApprovals: 0,
    };
  }
}
