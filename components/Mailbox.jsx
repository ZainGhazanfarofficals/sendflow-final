"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';


const Mailbox = () => {
  const [replies, setReplies] = useState([]);
  const [selectedReply, setSelectedReply] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({}); // Tracks which replies are expanded

  const toggleReply = (index) => {
    setExpandedReplies(prevExpandedReplies => ({
      ...prevExpandedReplies,
      [index]: !prevExpandedReplies[index]
    }));
  };

  const { data: user } = useSession();
  const mail = user?.user?.email;

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get('/api/incomingEmail', {
          params: { mail },
        });
        if (response.status === 200) {
          setReplies(response.data);
        } else {
          console.error('Error fetching email replies.');
        }
      } catch (error) {
        console.error('Error fetching email replies:', error);
      }
    };

    fetchReplies();
  }, []);

  const handleReplyClick = (reply) => {
    setSelectedReply(reply);
  };

  const handleCloseReply = () => {
    setSelectedReply(null);
  };

  const formatMessage = (content) => {
    return content
      .split('\n')
      .slice(0, 3)
      .map((line, index) => (
        <p key={index}>
          {line.trim() && !line.startsWith('>') ? line : null}
        </p>
      ));
  };
  const PreviewMessage = (content) => {
    return content
      .split('\n')
      .map((line, index) => (
        <p key={index}>
          {line.trim() && !line.startsWith('>') ? line : null}
        </p>
      ));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
            Mailbox
          </p>
          <p className="text-sm text-slate-300">Recent replies captured via SMTP.</p>
        </div>
        {selectedReply && (
          <button
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20"
            onClick={handleCloseReply}
          >
            Back to list
          </button>
        )}
      </div>

      {selectedReply ? (
        <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-inner">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
            From
          </div>
          <div className="text-sm font-semibold">{selectedReply.senderEmail}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
            To
          </div>
          <div className="text-sm text-slate-200 break-all">{selectedReply.recipients}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
            Message
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-100">
            {PreviewMessage(selectedReply.content)}
          </div>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {replies.map((reply, index) => (
            <li
              key={index}
              className="space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-lg"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
                From
              </div>
              <div className="text-sm font-semibold">{reply.senderEmail}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
                To
              </div>
              <div className="text-xs text-slate-200 break-all">{reply.recipients}</div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-slate-100 line-clamp-3">
                {formatMessage(reply.content)}
              </div>
              <button
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-2 text-sm font-semibold text-slate-900 shadow hover:-translate-y-0.5 transition"
                onClick={() => handleReplyClick(reply)}
              >
                Read more
              </button>
            </li>
          ))}
          {replies.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-slate-300">
              No replies captured yet.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default Mailbox;
