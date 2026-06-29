import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    name = "{name}",
    email = "{email}",
    company = "{company}",
    other = "{other}",
    tone = "concise, friendly, B2B",
    goal = "book a discovery call",
  } = await req.json();

  const apiUrl = process.env.LEMONFOX_API_URL;
  const apiKey = process.env.LEMONFOX_API_KEY;

  let subject;
  let body;
  let source = "fallback";

  // Try LemonFox API if configured
  if (apiUrl && apiKey) {
    try {
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name,
          email,
          company,
          other,
          tone,
          goal,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        subject = data.subject || data.title;
        body = data.body || data.content || data.text;
        source = "lemonfox";
      } else {
        console.error("LemonFox API error:", await resp.text());
      }
    } catch (err) {
      console.error("LemonFox request failed:", err);
    }
  }

  // Fallback template to avoid breaking the flow
  if (!subject) subject = `Quick idea for ${company}`;
  if (!body) {
    body = `Hey ${name},\n\nNoticed ${company} is scaling outreach. I put together a short plan tailored to ${other} that could lift replies.\n\nIf you're open to it, can we schedule a 10-minute walkthrough? Happy to share the sample sequence and swap ideas.\n\nCheers,\n{{your name}}\n`;
  }

  return NextResponse.json({ subject, body, source });
}
