export interface AgentContext {
  /** Directory where agents persist state, results, and pending approvals. */
  dataDir: string;
  now: Date;
}

export interface AgentResult {
  agent: string;
  ranAt: string;
  /** One-paragraph human-readable summary of what the agent did/found. */
  summary: string;
  /** Structured payload for the coordinator to merge into the daily brief. */
  details?: unknown;
  /** Number of actions waiting for human approval. */
  pendingApprovals: number;
}

export interface AgentDefinition {
  name: string;
  description: string;
  run(ctx: AgentContext): Promise<AgentResult>;
}
