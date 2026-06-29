"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar({ session }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored || (prefersDark ? "dark" : "light");
    applyTheme(next);
  }, []);

  const applyTheme = (mode) => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "AI Emails", href: "#ai-email" },
    { label: "Compliance", href: "#compliance" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link className="flex items-center text-2xl font-black tracking-tight text-slate-900 dark:text-white" href="/">
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">DocPad</span>
        </Link>

        {session === null && (
          <div className="hidden items-center gap-1 text-sm text-slate-700 dark:text-slate-200 md:flex" id="navbar-sticky">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2">
             {session?.user?.image && (
                <Image
                  className="rounded-full border border-white/10"
                  src={session?.user?.image}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
              <div className="text-sm font-semibold text-white">{session?.user?.name}</div>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {session !== null ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSignOut}
                className="rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
              >
                Sign Out
              </button>
           
            </div>
          ) : (
            <Link
              className="rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-extrabold text-ink shadow-glow transition hover:-translate-y-0.5"
              href="/login"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
