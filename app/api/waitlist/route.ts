import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, project } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize project slug
    const slug =
      typeof project === "string" && /^[a-z0-9-]{1,40}$/.test(project)
        ? project
        : "general";

    const formspreeId = process.env.FORMSPREE_FORM_ID;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY;

    // Option 1: Formspree
    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project: slug }),
      });
      if (!res.ok) throw new Error("Formspree submission failed");
      return NextResponse.json({ ok: true });
    }

    // Option 2: ConvertKit
    if (convertKitFormId && convertKitApiKey) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: convertKitApiKey, email }),
        }
      );
      if (!res.ok) throw new Error("ConvertKit subscription failed");
      return NextResponse.json({ ok: true });
    }

    // Fallback: log only
    console.log(`📧 Waitlist signup: ${email} (project: ${slug})`);
    console.log(
      "⚠️  Set FORMSPREE_FORM_ID or CONVERTKIT_FORM_ID/CONVERTKIT_API_KEY in Vercel to enable real collection"
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
