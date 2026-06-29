"use client";

import { useEffect, useRef, useState } from "react";

const loadAsset = (href, isCss = false) =>
  new Promise((resolve, reject) => {
    const selector = isCss ? `link[href="${href}"]` : `script[src="${href}"]`;
    const exists = document.querySelector(selector);
    if (exists) return resolve();
    const el = document.createElement(isCss ? "link" : "script");
    if (isCss) {
      el.rel = "stylesheet";
      el.href = href;
    } else {
      el.src = href;
    }
    el.onload = resolve;
    el.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(el);
  });

const loadWithFallbacks = async (urls, isCss = false) => {
  let lastError;
  for (const url of urls) {
    try {
      await loadAsset(url, isCss);
      return url;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("All sources failed");
};

const templates = [
  {
    name: "Hero CTA",
    desc: "Gradient hero, bold CTA, social footer.",
    html: `
      <table style="margin:0 auto; max-width:640px; width:100%; background:radial-gradient(circle at 20% 20%,#1d4ed8 0,#0f172a 40%),#020617; color:#e2e8f0; font-family:Inter,Arial,sans-serif; padding:32px; border-radius:18px;">
        <tr><td style="text-align:center; padding-bottom:14px;">
          <div style="display:inline-block; padding:10px 16px; background:linear-gradient(120deg,#38bdf8,#34d399); color:#0f172a; font-weight:800; border-radius:999px;">{logo}</div>
        </td></tr>
        <tr><td style="padding:18px; background:#0b1224; border-radius:14px; border:1px solid #1f2937;">
          <h2 style="margin:0 0 10px; font-size:22px; color:#e2e8f0;">Hey {name},</h2>
          <div style="margin:0 0 18px; color:#cbd5e1; line-height:1.6; white-space:pre-line;">{body}</div>
          <div style="text-align:center;">
            <a class="doc-btn" href="https://cal.com" style="display:inline-block; padding:12px 18px; background:linear-gradient(120deg,#22d3ee,#34d399); color:#0f172a; font-weight:700; text-decoration:none; border-radius:12px;">Book a 10‑min intro</a>
          </div>
        </td></tr>
        <tr><td style="text-align:center; color:#94a3b8; font-size:12px; padding-top:14px;">
          <div style="margin-bottom:8px;">Follow us</div>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="{linkedin}" style="color:#cbd5e1; text-decoration:none;">LinkedIn</a>
            <a href="{twitter}" style="color:#cbd5e1; text-decoration:none;">Twitter</a>
            <a href="{website}" style="color:#cbd5e1; text-decoration:none;">Website</a>
          </div>
          <div style="margin-top:8px;">Sent to {email}. Reply stop to opt-out.</div>
        </td></tr>
      </table>
    `,
  },
  {
    name: "Newsletter",
    desc: "Editorial look with body block + CTA.",
    html: `
      <table style="margin:0 auto; max-width:660px; width:100%; background:#0b1224; color:#e2e8f0; font-family:Inter,Arial,sans-serif; padding:28px; border-radius:18px; border:1px solid #1f2937;">
        <tr><td style="text-align:left; padding-bottom:14px;">
          <div style="display:inline-block; padding:8px 14px; background:#1e293b; border-radius:10px; font-weight:700;">{logo}</div>
          <h2 style="margin:12px 0 0; font-size:24px;">{company} x DocPad</h2>
          <p style="margin:4px 0 0; color:#94a3b8;">Personalized outreach ideas for {name}</p>
        </td></tr>
        <tr><td style="padding:14px; background:#0f172a; border-radius:14px; border:1px solid #1e293b;">
          <div style="margin:0; color:#cbd5e1; line-height:1.6; white-space:pre-line;">{body}</div>
          <div style="margin-top:16px; text-align:left;">
            <a class="doc-btn" href="https://cal.com" style="display:inline-block; padding:11px 16px; background:linear-gradient(120deg,#38bdf8,#34d399); color:#0f172a; font-weight:700; text-decoration:none; border-radius:10px;">See the sequence</a>
          </div>
        </td></tr>
        <tr><td style="text-align:center; color:#94a3b8; font-size:12px; padding-top:14px;">
          <div style="margin-bottom:8px;">Follow us</div>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="{linkedin}" style="color:#cbd5e1; text-decoration:none;">LinkedIn</a>
            <a href="{twitter}" style="color:#cbd5e1; text-decoration:none;">Twitter</a>
            <a href="{website}" style="color:#cbd5e1; text-decoration:none;">Website</a>
          </div>
          <div style="margin-top:8px;">Sent to {email}. Reply stop to opt-out.</div>
        </td></tr>
      </table>
    `,
  },
  {
    name: "Product Spotlight",
    desc: "Feature cards + body copy + CTA.",
    html: `
      <table style="margin:0 auto; max-width:680px; width:100%; background:linear-gradient(135deg,#0f172a,#111827 60%,#1e3a8a); color:#e2e8f0; font-family:Inter,Arial,sans-serif; padding:30px; border-radius:18px;">
        <tr><td style="text-align:center; padding-bottom:10px;">
          <div style="display:inline-block; padding:8px 14px; background:#1e293b; border-radius:12px; font-weight:700;">{logo}</div>
          <h2 style="margin:12px 0 0; font-size:24px;">A quicker path to replies for {company}</h2>
          <p style="margin:6px 0 0; color:#94a3b8;">Crafted for {name} around {other}</p>
        </td></tr>
        <tr><td>
          <table style="width:100%; border-spacing:12px;">
            <tr>
              <td style="background:#0b1224; border:1px solid #1e293b; border-radius:12px; padding:12px;">
                <strong>Deliverability</strong>
                <p style="margin:6px 0 0; color:#cbd5e1;">Rotates accounts and warmup safe windows.</p>
              </td>
              <td style="background:#0b1224; border:1px solid #1e293b; border-radius:12px; padding:12px;">
                <strong>Personalization</strong>
                <p style="margin:6px 0 0; color:#cbd5e1;">Uses {other} hooks to lift opens & replies.</p>
              </td>
            </tr>
          </table>
          <div style="margin:12px 0; padding:12px; background:#0b1224; border:1px solid #1e293b; border-radius:12px; color:#cbd5e1; white-space:pre-line;">
            {body}
          </div>
          <div style="text-align:center; margin-top:10px;">
            <a class="doc-btn" href="https://cal.com" style="display:inline-block; padding:12px 18px; background:linear-gradient(120deg,#22d3ee,#4ade80); color:#0f172a; font-weight:700; text-decoration:none; border-radius:12px;">Show me how</a>
          </div>
        </td></tr>
        <tr><td style="text-align:center; color:#94a3b8; font-size:12px; padding-top:12px;">
          <div style="margin-bottom:8px;">Follow us</div>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="{linkedin}" style="color:#cbd5e1; text-decoration:none;">LinkedIn</a>
            <a href="{twitter}" style="color:#cbd5e1; text-decoration:none;">Twitter</a>
            <a href="{website}" style="color:#cbd5e1; text-decoration:none;">Website</a>
          </div>
          <div style="margin-top:8px;">Sent to {email}. Reply stop to opt-out. GDPR/CAN-SPAM aligned.</div>
        </td></tr>
      </table>
    `,
  },
  {
    name: "Promo Offer",
    desc: "Limited-time promo with pricing highlight.",
    html: `
      <table style="margin:0 auto; max-width:640px; width:100%; background:linear-gradient(135deg,#0f172a 0%,#111827 50%,#0ea5e9 120%); color:#e2e8f0; font-family:Inter,Arial,sans-serif; padding:28px; border-radius:18px;">
        <tr><td style="text-align:center; padding-bottom:12px;">
          <div style="display:inline-block; padding:10px 16px; background:#1e293b; border-radius:12px; font-weight:800;">{logo}</div>
          <div style="font-size:26px; font-weight:800; letter-spacing:-0.02em; margin-top:10px;">Special for {company}</div>
          <div style="color:#cbd5e1; margin-top:4px;">Crafted for {name} around {other}</div>
        </td></tr>
        <tr><td style="padding:16px; background:rgba(15,23,42,0.7); border-radius:14px; border:1px solid rgba(255,255,255,0.08);">
          <table style="width:100%; border-spacing:0;">
            <tr>
              <td style="padding:12px;">
                <div style="font-size:36px; font-weight:800; color:#34d399;">25% off</div>
                <div style="color:#cbd5e1; white-space:pre-line;">{body}</div>
              </td>
              <td style="text-align:right; padding:12px;">
                <a class="doc-btn" href="https://cal.com" style="display:inline-block; padding:12px 18px; background:linear-gradient(120deg,#22d3ee,#34d399); color:#0f172a; font-weight:700; text-decoration:none; border-radius:12px;">Claim slot</a>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding-top:12px; text-align:center; color:#94a3b8; font-size:12px;">
          <div style="margin-bottom:8px;">Follow us</div>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="{linkedin}" style="color:#cbd5e1; text-decoration:none;">LinkedIn</a>
            <a href="{twitter}" style="color:#cbd5e1; text-decoration:none;">Twitter</a>
            <a href="{website}" style="color:#cbd5e1; text-decoration:none;">Website</a>
          </div>
          <div style="margin-top:8px;">Sent to {email}. Reply stop to opt-out.</div>
        </td></tr>
      </table>
    `,
  },
  {
    name: "Webinar Invite",
    desc: "Event-focused with agenda and body block.",
    html: `
      <table style="margin:0 auto; max-width:660px; width:100%; background:linear-gradient(135deg,#0b1224,#0f172a 55%,#f97316 130%); color:#e2e8f0; font-family:Inter,Arial,sans-serif; padding:30px; border-radius:20px; border:1px solid #1f2937;">
        <tr><td style="text-align:center;">
          <div style="display:inline-block; padding:8px 14px; background:#1e293b; border-radius:999px; color:#cbd5e1; font-size:13px;">Live session for {company}</div>
          <div style="margin-top:10px; font-weight:800;">{logo}</div>
          <h2 style="margin:12px 0 6px; font-size:24px;">From inbox to booked calls</h2>
          <p style="margin:0; color:#94a3b8;">Featuring deliverability tips tailored to {other}</p>
        </td></tr>
        <tr><td style="padding:16px; background:#0f172a; border-radius:14px; border:1px solid #1e293b; margin-top:12px;">
          <div style="color:#cbd5e1; line-height:1.6; white-space:pre-line;">{body}</div>
          <div style="text-align:center; margin-top:14px;">
            <a class="doc-btn" href="https://cal.com" style="display:inline-block; padding:12px 18px; background:linear-gradient(120deg,#fbbf24,#fb7185); color:#0f172a; font-weight:700; text-decoration:none; border-radius:12px;">Save my seat</a>
          </div>
        </td></tr>
        <tr><td style="padding-top:14px; text-align:center; color:#94a3b8; font-size:12px;">
          <div style="margin-bottom:8px;">Follow us</div>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="{linkedin}" style="color:#cbd5e1; text-decoration:none;">LinkedIn</a>
            <a href="{twitter}" style="color:#cbd5e1; text-decoration:none;">Twitter</a>
            <a href="{website}" style="color:#cbd5e1; text-decoration:none;">Website</a>
          </div>
          <div style="margin-top:8px;">Sent to {email}. Reply stop to opt-out.</div>
        </td></tr>
      </table>
    `,
  },
];

export default function LayoutBuilderPage() {
  const editorRef = useRef(null);
  const [status, setStatus] = useState("Loading editor…");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].name);
  const [activeDevice, setActiveDevice] = useState("Desktop");
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const cssSource = await loadWithFallbacks(
          [
            "https://unpkg.com/grapesjs/dist/css/grapes.min.css",
            "https://cdn.jsdelivr.net/npm/grapesjs/dist/css/grapes.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.5/css/grapes.min.css",
          ],
          true
        );

        const jsSource = await loadWithFallbacks([
          "https://unpkg.com/grapesjs/dist/grapes.min.js",
          "https://cdn.jsdelivr.net/npm/grapesjs/dist/grapes.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.5/grapes.min.js",
        ]);

        await loadWithFallbacks([
          "https://unpkg.com/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.min.js",
          "https://cdn.jsdelivr.net/npm/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/grapesjs-preset-newsletter/0.3.4/grapesjs-preset-newsletter.min.js",
        ]);

        const gjs = window.grapesjs;
        if (!gjs || editorRef.current) return;

        const editor = gjs.init({
          container: "#gjs",
          height: "75vh",
          fromElement: false,
          storageManager: false,
          plugins: ["gjs-preset-newsletter"],
          pluginsOpts: {
            "gjs-preset-newsletter": {
              modalTitle: "Email Blocks",
              showStylesOnChange: true,
            },
          },
          canvas: {
            styles: [cssSource],
          },
          deviceManager: {
            devices: [
              { name: "Desktop", width: "" },
              { name: "Tablet", width: "768px" },
              { name: "Mobile", width: "414px" },
            ],
          },
        });

        // Custom blocks: button + section shell
        editor.BlockManager.add("docpad-button", {
          label: "CTA Button",
          category: "DocPad",
          attributes: { class: "gjs-fonts gjs-f-button" },
          content:
            '<a class="doc-btn" href="#" style="display:inline-block; padding:12px 18px; background:linear-gradient(120deg,#22d3ee,#4ade80); color:#0f172a; font-weight:700; text-decoration:none; border-radius:12px;">Call to action</a>',
        });

        editor.BlockManager.add("docpad-section", {
          label: "Section",
          category: "DocPad",
          attributes: { class: "gjs-fonts gjs-f-hero" },
          content: `
            <section style="padding:18px; background:#0b1224; border-radius:12px; border:1px solid #1f2937;">
              <h3 style="margin:0 0 8px; color:#e2e8f0;">Headline</h3>
              <p style="margin:0; color:#cbd5e1;">Write something with {name}, {company}, {other} placeholders.</p>
            </section>
          `,
        });

        editor.setComponents(templates[0].html);

        editor.addStyle(`
          body { background: radial-gradient(circle at 20% 20%, #0ea5e9 0, transparent 25%), #020617; }
          .gjs-editor { background: #020617; }
          .doc-btn:hover { filter: brightness(1.08); }
        `);

        editorRef.current = editor;
        setStatus("Ready (source: " + (jsSource?.split("/")[2] || "cdn") + ")");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load editor. Check network access to CDN (unpkg/jsDelivr/cdnjs).");
      }
    };

    init();
  }, []);

  const handleCopy = async () => {
    try {
      const html = editorRef.current?.getHtml() || "";
      const css = editorRef.current?.getCss() || "";
      await navigator.clipboard.writeText(
        `<!doctype html><html><head><style>${css}</style></head><body>${html}</body></html>`
      );
      setStatus("Exported to clipboard");
    } catch (err) {
      setStatus("Copy failed");
    }
  };

  const handleReset = () => {
    if (!editorRef.current) return;
    editorRef.current.runCommand("preset-newsletter:template");
    setStatus("Template reset");
  };

  const applyTemplate = (name) => {
    const tpl = templates.find((t) => t.name === name);
    if (!tpl || !editorRef.current) return;
    editorRef.current.setComponents(tpl.html);
    setSelectedTemplate(name);
    setStatus(`Applied template: ${name}`);
  };

  const handleOpenBlocks = () => {
    editorRef.current?.runCommand("open-blocks");
  };

  const handleDeviceChange = (device) => {
    setActiveDevice(device);
    editorRef.current?.setDevice(device);
  };

  const handleAiApply = () => {
    if (!editorRef.current) return;
    const prompt = aiPrompt.toLowerCase();
    let choice = templates[0];
    if (prompt.includes("webinar") || prompt.includes("event")) choice = templates.find(t => t.name === "Webinar Invite");
    else if (prompt.includes("promo") || prompt.includes("discount") || prompt.includes("offer")) choice = templates.find(t => t.name === "Promo Offer");
    else if (prompt.includes("newsletter") || prompt.includes("update")) choice = templates.find(t => t.name === "Newsletter");
    else if (prompt.includes("product") || prompt.includes("feature")) choice = templates.find(t => t.name === "Product Spotlight");
    editorRef.current.setComponents((choice || templates[0]).html);
    setSelectedTemplate(choice?.name || templates[0].name);
    setStatus(`AI picked: ${(choice || templates[0]).name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
            Layout
          </p>
          <h1 className="text-xl font-semibold">Email layout builder</h1>
          <p className="text-sm text-slate-300">
            Drag & drop an email, keep placeholders {`{name}`}, {`{email}`}, {`{company}`}, {`{other}`}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex overflow-hidden rounded-xl border border-white/15 bg-white/10 text-xs">
            {["Desktop", "Tablet", "Mobile"].map((d) => (
              <button
                key={d}
                onClick={() => handleDeviceChange(d)}
                className={`px-3 py-2 font-semibold ${
                  activeDevice === d
                    ? "bg-gradient-to-r from-blue-500 to-emerald-400 text-slate-900"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={handleOpenBlocks}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-slate-100 hover:bg-white/20"
          >
            Open blocks
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-slate-100 hover:bg-white/20"
          >
            Reset template
          </button>
          <button
            onClick={handleCopy}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            Copy HTML
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-2 shadow-2xl">
          <div id="gjs" className="min-h-[70vh] rounded-xl bg-slate-900/80"></div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-50 shadow-2xl backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
            Templates
          </div>
          {templates.map((tpl) => (
            <div
              key={tpl.name}
              className={`rounded-xl border border-white/10 bg-slate-900/40 p-3 shadow ${selectedTemplate === tpl.name ? "ring-2 ring-emerald-400/60" : ""
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{tpl.name}</div>
                  <div className="text-xs text-slate-300">{tpl.desc}</div>
                </div>
                <button
                  onClick={() => applyTemplate(tpl.name)}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-1 text-xs font-semibold text-slate-900 shadow hover:-translate-y-0.5 transition"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3 shadow space-y-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">AI layout helper</div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. need a webinar invite for SaaS founders"
              className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
              rows={2}
            />
            <div className="flex flex-wrap gap-2">
              {["promo offer", "product feature", "webinar event", "newsletter update"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setAiPrompt(chip)}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/20"
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              onClick={handleAiApply}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              Apply with AI
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400">Status: {status}</div>
    </div>
  );
}
