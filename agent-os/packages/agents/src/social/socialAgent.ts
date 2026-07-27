import { BaseAgent, type AgentContext, type Store } from "@hoshmand/core";

/**
 * Social media agent — v2 scope.
 * Planned, using only official APIs:
 *  - X (pay-per-use API): draft + schedule posts for personal and Hoshmand AI accounts
 *  - LinkedIn Community Management API: company page posts + personal profile posts
 *  - Instagram Business + Facebook Page via Meta Graph API: posts, comment replies
 * All posts go through the approval queue before publishing. Batch reads
 * (1-2x/day) to keep X pay-per-use costs near zero.
 * Deliberately out of scope: personal Facebook/Instagram profiles (no API),
 * LinkedIn DM/connection automation (ToS violation, active enforcement).
 */
export class SocialAgent extends BaseAgent {
  readonly name = "social";
  readonly description = "Draft and schedule social posts across X, LinkedIn, IG/FB business. (Not yet implemented.)";

  async execute(_ctx: AgentContext, _store: Store) {
    return {
      summary: "Social agent not yet implemented — planned for v2.",
      pendingApprovals: 0,
    };
  }
}
