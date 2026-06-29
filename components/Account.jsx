"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

export default function Accounts() {
  const [entries, setEntries] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: user } = useSession();
  const acc = user?.user?.email;

  const isEditing = useMemo(() => Boolean(editId), [editId]);

  useEffect(() => {
    if (!acc) return;
    setLoading(true);
    fetch(`/api/entries?acc=${acc}`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setError("Failed to load accounts"))
      .finally(() => setLoading(false));
  }, [acc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acc) return;
    setLoading(true);
    setError("");

    try {
      if (editId) {
        const updatedEntry = await fetch(`/api/entries/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }).then((res) => res.json());
        setEntries(entries.map((entry) => (entry._id === editId ? updatedEntry : entry)));
        setEditId(null);
      } else {
        const newEntry = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, acc }),
        }).then((res) => res.json());
        setEntries([...entries, newEntry]);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Unable to save account");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEmail(entry.email);
    setPassword(entry.appPassword);
    setEditId(entry._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await fetch(`/api/entries/${id}`, { method: "DELETE" });
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      setError("Unable to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Email senders</p>
            <h2 className="text-lg font-semibold">Manage accounts</h2>
          </div>
          {loading && <span className="text-xs text-slate-300">Loading…</span>}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-200">App password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
            />
            <a
              className="text-xs text-emerald-300 underline underline-offset-2"
              target="_blank"
              href="https://myaccount.google.com/apppasswords"
            >
              Generate app password
            </a>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
        {error && <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</div>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-[420px] w-full text-left text-sm text-slate-100">
            <thead className="bg-white/5 text-xs uppercase text-slate-300">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">App Password</th>
                <th className="px-4 py-3 w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 break-all text-xs sm:text-sm">{entry.email}</td>
                  <td className="px-4 py-3 break-all font-mono text-xs text-slate-300">{entry.appPassword}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="w-full rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10 sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="w-full rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-500/20 sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-300">
                    No accounts yet. Add your first sender above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
