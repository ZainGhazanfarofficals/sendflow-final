"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import './mailbox.css';


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
    <div className="grid-center">
    {selectedReply ? (
      <div className="form-container">
        <button className="back-button" onClick={handleCloseReply}>
          Back to Replies
        </button><br />
        <div className="reply-item">
          <strong>From: {selectedReply.senderEmail}</strong>
          <p>To: {selectedReply.recipients}</p>
          <strong>Message:</strong>
          <div className="reply-content">{PreviewMessage(selectedReply.content)}</div>
        </div>
      </div>
    ) : (
      <ul>
        {replies.map((reply, index) => (
          <li key={index} className="reply-item">
            <strong>From: {reply.senderEmail}</strong>
            <p>To: {reply.recipients}</p>
            <strong>Message:</strong>
            <div className="reply-content">{formatMessage(reply.content)}</div>
            <button
              className="read-more-button"
              onClick={() => handleReplyClick(reply)}
            >
              Read More
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default Mailbox;