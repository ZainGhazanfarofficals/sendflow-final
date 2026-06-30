"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      setSubmitting(true);
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
        setError("Registration failed. Try again.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-900 dark:from-ink dark:via-surface dark:to-black dark:text-textPrimary">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[15%] top-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,139,255,0.16),transparent_60%)] blur-3xl" />
        <div className="absolute right-[12%] top-[0%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,245,215,0.14),transparent_55%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between px-5 py-12 gap-10">
        <div className="hidden w-1/2 flex-col gap-4 md:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-textPrimary">
            Create account
          </span>
          <h1 className="text-4xl font-black leading-tight">
            Start using DocPad for cold calls, AI emails, and compliant outreach.
          </h1>
          <p className="max-w-xl text-slate-600 dark:text-textSecondary">
            One login for campaigns, live coaching, analytics, and governance controls. Your workspace stays secure and audit-ready.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "AI copy with compliance guardrails",
              "Predictive dialer + live coaching",
              "Deliverability-safe sequences",
              "Audit logs & consent tracking",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-textPrimary"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-white/10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent2">Register</p>
                <h2 className="text-2xl font-bold">Create your workspace access</h2>
              </div>
              <Link
                href="/"
                className="text-sm text-accent2 underline-offset-4 hover:underline"
              >
                Back to site
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ada Lovelace"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-textPrimary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-textPrimary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-textPrimary"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>

              <div className="text-center text-sm text-slate-600 dark:text-textSecondary">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-accent2 underline-offset-4 hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
