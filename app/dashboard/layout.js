import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-6 pt-24 lg:grid-cols-[260px_1fr] lg:gap-6 lg:px-6">
        <Sidebar />

        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Control Center
              </p>
              <h1 className="text-2xl font-bold text-white">DocPad Dashboard</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-sm font-semibold text-emerald-200">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
              Live
            </div>
          </header>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
