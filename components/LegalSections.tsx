"use client";

import { useState } from "react";
import Accordion from "./ui/Accordion";

export default function LegalSections({ sections }: { sections: { title: string; content: string }[] }) {
  const [all, setAll] = useState<boolean | undefined>(undefined);
  const expanded = all === true;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13px] text-warm-500">{sections.length} sections</p>
        <button
          type="button"
          onClick={() => setAll(!expanded)}
          className="btn-secondary !h-9 !px-4 text-[12.5px]"
        >
          {expanded ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <Accordion
        variant="card"
        allowMultiple
        defaultOpen={0}
        expandAll={all}
        items={sections.map((s, i) => ({
          title: s.title,
          meta: <span className="w-6 text-[12px] font-semibold tabular-nums text-gold-600">{String(i + 1).padStart(2, "0")}</span>,
          content: <p>{s.content}</p>,
        }))}
      />
    </div>
  );
}
