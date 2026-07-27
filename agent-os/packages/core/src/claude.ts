import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

let client: Anthropic | undefined;

export function claude(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export function modelFor(agentName: string): string {
  const perAgent = process.env[`AGENT_MODEL_${agentName.toUpperCase()}`];
  return perAgent ?? process.env.AGENT_MODEL ?? "claude-opus-5";
}

/**
 * One structured Claude call: system + user prompt in, schema-validated object out.
 * Throws if the response cannot be parsed into the schema.
 */
export async function structured<T extends z.ZodType>(opts: {
  agent: string;
  system: string;
  prompt: string;
  schema: T;
  maxTokens?: number;
}): Promise<z.infer<T>> {
  const response = await claude().messages.parse({
    model: modelFor(opts.agent),
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: [{ role: "user", content: opts.prompt }],
    output_config: { format: zodOutputFormat(opts.schema) },
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`Claude refused the request for agent ${opts.agent}`);
  }
  if (response.parsed_output == null) {
    throw new Error(`Unparseable structured output for agent ${opts.agent}`);
  }
  return response.parsed_output;
}

/** Plain-text Claude call for prose outputs (briefs, drafts). */
export async function prose(opts: {
  agent: string;
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<string> {
  const response = await claude().messages.create({
    model: modelFor(opts.agent),
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: [{ role: "user", content: opts.prompt }],
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`Claude refused the request for agent ${opts.agent}`);
  }
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}
