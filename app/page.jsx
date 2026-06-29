import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("getServerSession error on home", error);
  }

  if (session) redirect("/dashboard");

  const metrics = [
    { value: "3.2x", label: "reply rate vs. industry" },
    { value: "82%", label: "calls classified automatically" },
    { value: "14 min", label: "avg. rep time saved daily" },
    { value: "GDPR", label: "compliant by default" },
  ];

  const features = [
    {
      title: "Cold calling that actually converts",
      copy: "Predictive dialer, local presence, and live talk tracks trained on your top reps to coach sellers while they speak.",
    },
    {
      title: "Agent coaching in the moment",
      copy: "Real-time objection handling, sentiment flags, and next-best-action cards keep new reps from stalling out.",
    },
    {
      title: "Cold email campaigns",
      copy: "Sequence builders with throttling, warm-up, and smart send windows so you land in inboxes—not spam folders.",
    },
    {
      title: "AI-powered email generation",
      copy: "Voice-matched, product-aware copy that auto-inserts proof points and compliance language for every segment.",
    },
  ];

  const workflows = [
    {
      title: "Capture & target",
      copy: "Import from your CRM, enrich with firmographics, auto-score accounts, and route the right reps instantly.",
    },
    {
      title: "Call with confidence",
      copy: "Live AI coaching, sentiment detection, and dynamic talk tracks keep conversations on-message and compliant.",
    },
    {
      title: "Email with intent",
      copy: "Deliverability guardrails, smart send windows, and AI that personalizes without tripping spam filters.",
    },
    {
      title: "Measure & adapt",
      copy: "Dashboards, A/B testing, and exports into your data warehouse make optimization continuous.",
    },
  ];

  const aiEmail = [
    {
      title: "Context-aware drafts",
      copy: "Pulls persona, pain, and product proof points to generate emails that feel written by your best rep.",
    },
    {
      title: "Deliverability safe",
      copy: "SPF/DKIM checks, throttling, warm-up, and inbox rotation to keep you off blacklists.",
    },
    {
      title: "Localized & compliant",
      copy: "Language detection, consent tracking, and automatic unsubscribe/preference center links baked in.",
    },
  ];

  const compliance = [
    "GDPR-ready data processing and export",
    "Automatic unsubscribe + preference center",
    "Regional sending controls and audit logs",
    "PII redaction in recordings and transcripts",
  ];

  const faqs = [
    {
      q: "Is DocPad compliant with GDPR?",
      a: "Yes—data residency controls, processing addendum, and audit trails ship by default for every workspace.",
    },
    {
      q: "Can I use my existing numbers and domains?",
      a: "Absolutely. We verify and warm domains, manage pools, and support local presence across major regions.",
    },
    {
      q: "Does DocPad log back to my CRM?",
      a: "We auto-log calls, emails, notes, and outcomes to Salesforce and HubSpot, keeping your source of truth clean.",
    },
    {
      q: "How fast can we launch?",
      a: "Most teams launch within 1–2 days with our presets; larger rollouts include concierge onboarding.",
    },
  ];

  const testimonials = [
    {
      quote: "DocPad lifted our connect-to-meeting rate by 38% in the first month—rep coaching in-call is a cheat code.",
      name: "RevOps Lead, Series B SaaS",
    },
    {
      quote: "The AI emailer finally writes in our brand voice and stays compliant. Spam complaints dropped to near zero.",
      name: "Head of Sales Dev, Logistics Tech",
    },
  ];

  const integrations = ["Salesforce", "HubSpot", "Outlook", "Gmail", "Slack", "Zoom", "Stripe data", "Snowflake"];

  const primaryBtn =
    "rounded-xl bg-gradient-to-r from-accent to-accent2 px-5 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5";
  const secondaryBtn =
    "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-textPrimary";

  return (
    <main className="relative overflow-hidden bg-white text-slate-900 dark:bg-ink dark:text-textPrimary">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[12%] top-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,139,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute right-[10%] top-[0%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,245,215,0.16),transparent_55%)] blur-3xl" />
        <div className="absolute left-[40%] top-[32%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(79,139,255,0.12),transparent_60%)] blur-3xl" />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pt-28 pb-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-textPrimary">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_6px_rgba(79,139,255,0.18)]" />
            Built for modern revenue teams
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            DocPad makes <span className="bg-gradient-to-r from-accent2 to-accent bg-clip-text text-transparent">cold outreach</span> feel warm.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-textSecondary">
            All-in-one outbound platform for teams that need calls, coaching, email campaigns, and AI copy that stays compliant
            with GDPR and email standards.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className={primaryBtn}>Book a live demo</button>
            <button className={secondaryBtn}>Try the AI emailer</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-surface/80"
              >
                <div className="text-xl font-extrabold">{m.value}</div>
                <div className="text-sm text-slate-600 dark:text-textSecondary">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-surface/80">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Outreach control center</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-textSecondary">
              Live + async
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-base font-bold">{f.title}</div>
                <div className="text-sm text-slate-600 dark:text-textSecondary">{f.copy}</div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-accent2/40 bg-slate-50 p-3 dark:bg-white/5">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-accent2/60 text-lg font-extrabold text-accent2 shadow-[0_10px_30px_rgba(120,245,215,0.18)]">
              ✓
            </div>
            <div>
              <div className="font-semibold">Compliance baked in</div>
              <div className="text-sm text-slate-600 dark:text-textSecondary">
                {compliance.map((item, idx) => (
                  <span key={item}>
                    {item}
                    {idx !== compliance.length - 1 ? " • " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">Omnichannel toolkit</div>
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to reach, coach, and convert.</h2>
          <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
            From first touch to booked meeting—calls, emails, and AI support live in one workspace so reps stay focused on
            prospects, not tabs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <h4 className="text-lg font-semibold">{f.title}</h4>
              <p className="text-sm text-slate-600 dark:text-textSecondary">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ai-email" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">AI email engine</div>
            <h2 className="text-3xl font-bold tracking-tight">Personalized copy that respects deliverability.</h2>
            <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
              Generate cold emails, follow-ups, and break-up notes that stay on-brand, add social proof, and keep your domain
              reputation clean.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-textSecondary">
            <span className="text-slate-900 dark:text-textPrimary">Compliance-first</span>
            GDPR • CAN-SPAM
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {aiEmail.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="text-sm text-slate-600 dark:text-textSecondary">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflows" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">How it works</div>
          <h2 className="text-3xl font-bold tracking-tight">Launch fast, scale with control.</h2>
          <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
            DocPad plugs into your stack, guides reps live, and keeps every touch compliant with regional rules.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {workflows.map((flow, idx) => (
            <div
              key={flow.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-sm font-extrabold text-accent">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-semibold">{flow.title}</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-textSecondary">{flow.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="compliance" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">Compliance & governance</div>
            <h2 className="text-3xl font-bold tracking-tight">Guardrails that scale with you.</h2>
            <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
              Built-in GDPR workflows, consent capture, and redaction keep legal happy while reps stay productive.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-textSecondary">
            <span className="text-slate-900 dark:text-textPrimary">Data residency</span>
            EU / US / APAC
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {compliance.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <h4 className="text-lg font-semibold">{item}</h4>
              <p className="text-sm text-slate-600 dark:text-textSecondary">
                DocPad tracks evidence, logs actions, and keeps exports controlled so every review is fast and audit-ready.
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm font-semibold text-slate-700 dark:text-textSecondary">Works with your stack:</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {integrations.map((name) => (
            <span
              key={name}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-textPrimary"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">Proof</div>
          <h2 className="text-3xl font-bold tracking-tight">Teams ship faster and stay compliant.</h2>
          <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
            Revenue leaders use DocPad to keep outreach efficient without sacrificing governance or brand.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <h4 className="text-2xl font-extrabold">{m.value}</h4>
              <p className="text-sm text-slate-600 dark:text-textSecondary">{m.label}</p>
            </div>
          ))}
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm dark:border-white/10 dark:bg-surface dark:text-textSecondary"
            >
              “{t.quote}”
              <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-textPrimary">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">FAQ</div>
          <h2 className="text-3xl font-bold tracking-tight">Answers for your team and legal.</h2>
          <p className="max-w-3xl text-slate-600 dark:text-textSecondary">
            If you need something not covered here, we’ll walk through it live with your security and ops leads.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-surface"
            >
              <div className="text-base font-semibold">{item.q}</div>
              <p className="text-sm text-slate-600 dark:text-textSecondary">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cta" className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-accent/15 via-accent2/12 to-accent/15 px-6 py-10 text-center shadow-xl dark:border-white/15">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent2">Ready to upgrade</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Give your sellers AI superpowers—without compliance headaches.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-700 dark:text-textSecondary">
            Book a 20-minute walkthrough or try the AI emailer with your own sequences. We’ll configure governance for your region
            on day one.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button className={primaryBtn}>Book a live demo</button>
            <button className={secondaryBtn}>Start a test campaign</button>
          </div>
        </div>
      </section>
    </main>
  );
}
