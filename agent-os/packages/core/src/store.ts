import { promises as fs } from "fs";
import path from "path";

/**
 * Minimal JSON file store under the run's data directory.
 * Used for agent results (consumed by the coordinator), per-agent memory,
 * and the human-approval queue.
 */
export class Store {
  constructor(private readonly dataDir: string) {}

  private file(...parts: string[]): string {
    return path.join(this.dataDir, ...parts);
  }

  async writeJson(relPath: string, value: unknown): Promise<void> {
    const target = this.file(relPath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, JSON.stringify(value, null, 2), "utf8");
  }

  async readJson<T>(relPath: string): Promise<T | undefined> {
    try {
      return JSON.parse(await fs.readFile(this.file(relPath), "utf8")) as T;
    } catch {
      return undefined;
    }
  }

  async writeText(relPath: string, value: string): Promise<void> {
    const target = this.file(relPath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, value, "utf8");
  }

  async list(relDir: string): Promise<string[]> {
    try {
      return await fs.readdir(this.file(relDir));
    } catch {
      return [];
    }
  }
}

export interface PendingApproval {
  id: string;
  agent: string;
  createdAt: string;
  kind: string;
  description: string;
  payload: unknown;
}

/** Actions an agent wants to take but a human must approve first. */
export class ApprovalQueue {
  private readonly store: Store;

  constructor(dataDir: string) {
    this.store = new Store(dataDir);
  }

  async add(item: Omit<PendingApproval, "id" | "createdAt">): Promise<PendingApproval> {
    const full: PendingApproval = {
      ...item,
      id: `${item.agent}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    await this.store.writeJson(path.join("approvals", `${full.id}.json`), full);
    return full;
  }

  async pending(): Promise<PendingApproval[]> {
    const files = await this.store.list("approvals");
    const items: PendingApproval[] = [];
    for (const f of files) {
      const item = await this.store.readJson<PendingApproval>(path.join("approvals", f));
      if (item) items.push(item);
    }
    return items;
  }
}
