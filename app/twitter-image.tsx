import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

// The picture shown when a hoshmand.ai link is shared (iMessage, Instagram, LinkedIn, Slack, X).
export const runtime = "nodejs";
export const alt = `${site.name}: responsible AI studio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const mark = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/hoshmand-mark-512.png")).toString("base64")}`;
  const names = projects.map((p) => p.name).join("  ·  ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0A1628 0%, #0F2140 55%, #1E3A6A 100%)",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={88} height={88} style={{ borderRadius: 22 }} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Responsible AI, built to turn digital clutter into action.
          </div>
          <div style={{ fontSize: 30, color: "#D4A94F" }}>{names}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
          <div>www.hoshmand.ai</div>
          <div>{`Independent AI studio · Virginia · since ${site.foundingYear}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
