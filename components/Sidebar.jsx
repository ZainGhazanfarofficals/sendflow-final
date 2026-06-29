"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/accounts", label: "Accounts" },
    { href: "/dashboard/campaigns", label: "Campaigns" },
    { href: "/dashboard/layout-builder", label: "Layout" },
    { href: "/dashboard/mailbox", label: "Mailbox" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  const isActive = (href) => pathname?.startsWith(href);

  return (
    <div className="w-full">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-6 hidden h-fit flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur lg:flex">
        <div className="flex items-center gap-2 font-extrabold">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-300 shadow-[0_0_0_6px_rgba(79,139,255,0.25)]" />
          <span className="text-lg">DocPad</span>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-blue-500 to-emerald-400 text-slate-900 shadow-lg"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
          <div className="flex justify-between"><span>Status</span><span className="font-semibold text-emerald-300">Live</span></div>
          <div className="flex justify-between"><span>Workspace</span><span className="font-semibold">Team</span></div>
        </div>
      </aside>

      {/* Mobile nav pills */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-50 shadow-2xl backdrop-blur lg:hidden">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              isActive(item.href)
                ? "bg-gradient-to-r from-blue-500 to-emerald-400 text-slate-900 shadow-lg"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
