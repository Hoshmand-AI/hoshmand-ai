import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check for external provider configuration
    const formspreeId = process.env.FORMSPREE_FORM_ID;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY;

    // Option 1: Formspree
    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Formspree submission failed");
      }

      return NextResponse.json({ ok: true });
    }

    // Option 2: ConvertKit
    if (convertKitFormId && convertKitApiKey) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: convertKitApiKey,
            email,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("ConvertKit subscription failed");
      }

      return NextResponse.json({ ok: true });
    }

    // Fallback: Log to console (for development)
    console.log("📧 Waitlist signup:", email);
    console.log(
      "⚠️  Configure FORMSPREE_FORM_ID or CONVERTKIT_FORM_ID/CONVERTKIT_API_KEY to enable email collection"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
