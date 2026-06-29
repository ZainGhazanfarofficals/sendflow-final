"use client";

const summary = [
  { label: "Active campaigns", value: "12", trend: "+2 this week" },
  { label: "Meetings booked", value: "48", trend: "+14% vs last week" },
  { label: "Avg. reply rate", value: "9.8%", trend: "+0.6pp" },
  { label: "Compliance score", value: "99%", trend: "All checks passing" },
];

const tasks = [
  "Review new AI email suggestions for EMEA segment",
  "Approve Tuesday outbound dialer list",
  "Sync deliverability warm-up status",
  "Share analytics with RevOps",
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/30 via-emerald-400/25 to-blue-500/30 p-5 text-slate-900 shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-800">Overview</p>
          <h2 className="text-3xl font-extrabold leading-tight">Welcome back. Your outreach is humming.</h2>
          <p className="text-sm text-slate-800/80">Monitor performance, coach reps, and keep every sequence compliant.</p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition">
              Launch new campaign
            </button>
            <button className="rounded-xl border border-slate-900/20 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 hover:-translate-y-0.5 transition">
              View analytics
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { v: "3.2x", l: "Reply rate vs industry" },
            { v: "82%", l: "Calls classified automatically" },
            { v: "14 min", l: "Rep time saved per day" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white/70 p-3 text-slate-900 shadow-md">
              <div className="text-xl font-bold">{s.v}</div>
              <div className="text-xs text-slate-700">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-50 shadow-lg">
            <div className="text-xl font-bold">{item.value}</div>
            <div className="text-sm text-slate-200">{item.label}</div>
            <div className="text-xs text-emerald-300">{item.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Today</p>
              <h3 className="text-lg font-semibold">Action items</h3>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {tasks.map((t) => (
              <li key={t} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Compliance</p>
              <h3 className="text-lg font-semibold">Policy guardrails</h3>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {["GDPR ready", "Unsub links injected", "Audit log on", "Regional throttles"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-200"
              >
                {b}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-200">
            Deliverability and consent checks are active across all workspaces. No violations detected in the last 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
