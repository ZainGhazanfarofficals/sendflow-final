"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
        Profile
      </p>
      <div className="mt-2 space-y-1 text-sm text-slate-200">
        <div>
          Name: <span className="font-semibold text-slate-50">{session?.user?.name}</span>
        </div>
        <div className="break-all">
          Email: <span className="font-semibold text-slate-50">{session?.user?.email}</span>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="mt-4 rounded-xl bg-rose-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
      >
        Log Out
      </button>
    </div>
  );
}
