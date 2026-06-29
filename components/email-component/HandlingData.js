// SetupEmailButton.js
"use client";
import React, { useState,useEffect } from "react";
import SuccessModal from "./SuccessModal";

const HandlingData = ({onSendEmail,  email: propEmail, appPassword: propAppPassword, subject: propSubject, body: propBody}) => {
  const [email, setEmail] = useState(propEmail);
  const [appPassword, setAppPassword] = useState(propAppPassword);
  const [subject, setSubject] = useState(propSubject);
  const [body, setBody] = useState(propBody);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    // Update input fields when props change (e.g., switching tabs)
    setEmail(propEmail);
    setAppPassword(propAppPassword);
    setSubject(propSubject);
    setBody(propBody);
  }, [propEmail, propAppPassword, propSubject, propBody]);

  // Function to handle subject input change
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Function to handle email body input change
  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleGenerateWithAI = async () => {
    setAiLoading(true);
    setError("");
    try {
      const response = await fetch("/api/lemonfox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "{name}",
          email: "{email}",
          company: "{company}",
          other: "{other}",
          tone: "concise, friendly, B2B",
          goal: "book a quick discovery call",
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      setSubject(data.subject || subject);
      setBody(data.body || body);
      setSuccessMessage("Draft generated with LemonFox AI");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Could not generate email. Check LemonFox API config.");
    } finally {
      setAiLoading(false);
    }
  };

  // Function to handle the email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Function to handle the app password input change
  const handleAppPasswordChange = (e) => {
    setAppPassword(e.target.value);
  };
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the modal
  };


  const handleSendEmail = async () => {
    if (!email || !appPassword || !subject || !body) {
      setError('Please fill in all required fields.');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }

    try {
      // Pass the relevant data to the parent component using the prop function
      onSendEmail({ subject, body, email, appPassword });

      // Clear form fields and display success message
      setSuccessMessage('Email setup successfully.');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while setting up');
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Authenticate</p>
          <label className="text-xs text-slate-200">Sender Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={handleEmailChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
          />
          <label className="text-xs text-slate-200">App Password</label>
          <input
            type="password"
            placeholder="App password"
            value={appPassword}
            onChange={handleAppPasswordChange}
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

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Compose</p>
          <label className="text-xs text-slate-200">Subject</label>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={handleSubjectChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
          />
          <label className="text-xs text-slate-200">Body</label>
          <textarea
            rows="6"
            placeholder="Hey {name}, love what you're doing for {other} at {company}..."
            value={body}
            onChange={handleBodyChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>Available variables: <code className="text-emerald-200">{`{name}`}</code>, <code className="text-emerald-200">{`{email}`}</code>, <code className="text-emerald-200">{`{company}`}</code>, <code className="text-emerald-200">{`{other}`}</code></span>
            <button
              type="button"
              onClick={handleGenerateWithAI}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/20 disabled:opacity-50"
              disabled={aiLoading}
            >
              {aiLoading ? "Generating..." : "Generate with LemonFox AI"}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
              onClick={handleSendEmail}
            >
              Save content
            </button>
          </div>
          {error && <p className="text-sm text-rose-200">{error}</p>}
        </div>
      </div>

      {isSuccessModalOpen && (
        <SuccessModal SuccessMessage={successMessage} onClose={handleCloseSuccessModal} />
      )}
    </div>
  );
};

export default HandlingData;
