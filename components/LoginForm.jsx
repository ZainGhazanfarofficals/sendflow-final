"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");

  const router = useRouter();
  // Force-safe callback target
  const callbackUrl = "/dashboard";

  // Clean the URL in the browser if the callbackUrl is malformed
  useEffect(() => {
    if (!rawCallback) return;
    if (rawCallback !== callbackUrl) {
      router.replace("/login");
    }
  }, [rawCallback, callbackUrl, router]);
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    // Check if the input value is a valid email address
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsValidEmail(emailPattern.test(inputEmail));
  };
  const handlePasswordChange = (e) => {
    const inputpassword = e.target.value;
    setPassword(inputpassword);
    setIsValidPassword(inputpassword.length >= 8);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length >= 8 && isValidEmail) {
      setSubmitting(true);
      try {
        const res = await signIn("credentials", {
          email,
          password,
          callbackUrl,
        });
        if (res?.error) {
          setError("Invalid credentials. Please try again.");
          setSubmitting(false);
          return;
        }
        // NextAuth will redirect; no manual navigation needed
      } catch (error) {
        console.log(error);
        setError("Something went wrong. Try again.");
        setSubmitting(false);
      }
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-ink via-surface to-black text-textPrimary">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[12%] top-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,139,255,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute right-[10%] top-[0%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,245,215,0.16),transparent_55%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between px-5 py-12 gap-10">
        <div className="hidden w-1/2 flex-col gap-4 md:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
            Welcome back
          </span>
          <h1 className="text-4xl font-black leading-tight">
            Sign in to DocPad and pick up your outreach where you left off.
          </h1>
          <p className="max-w-xl text-textSecondary">
            Unified access to campaigns, calls, AI emails, and analytics—secured with role-based permissions.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "GDPR-ready workspace",
              "AI coaching for reps",
              "Deliverability guardrails",
              "Live analytics and logging",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent2">Log in</p>
                <h2 className="text-2xl font-bold">Access your workspace</h2>
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
                <label className="text-sm font-semibold text-textPrimary">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  onChange={handleEmailChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-textPrimary placeholder:text-slate-400 focus:border-accent focus:outline-none"
                  required
                />
                {!isValidEmail && (
                  <p className="text-sm text-rose-300">Please enter a valid email address.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-textPrimary">Password</label>
                <input
                  onChange={handlePasswordChange}
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-textPrimary placeholder:text-slate-400 focus:border-accent focus:outline-none"
                  required
                />
                {!isValidPassword && (
                  <p className="text-sm text-rose-300">Password must be at least 8 characters.</p>
                )}
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
                {submitting ? "Signing in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-textPrimary transition hover:-translate-y-0.5"
              >
                <span>Sign in with Google</span>
              </button>

              <div className="text-center text-sm text-textSecondary">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-accent2 underline-offset-4 hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
