// SetupEmailButton.js
"use client";
import React, { useState,useEffect } from "react";
import SuccessModal from "./SuccessModal";
import './handlingdata.css'

const HandlingData = ({onSendEmail,  email: propEmail, appPassword: propAppPassword, subject: propSubject, body: propBody}) => {
  const [email, setEmail] = useState(propEmail);
  const [appPassword, setAppPassword] = useState(propAppPassword);
  const [subject, setSubject] = useState(propSubject);
  const [body, setBody] = useState(propBody);
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
    <div className="handling-data-container">
      <div className="handling-data-card">
        <div className="mb-6">
        <label className="label-block">
            Authenticate Yourself:
          </label>
          <label className="label-block">Your Email:</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="input-full"
          />
          <br />
          <br />
          <label className="label-block">Password:</label>
          <input
            type="password"
            placeholder="App Password"
            value={appPassword}
            onChange={handleAppPasswordChange}
            className="input-full"
          />
          <br />
          <a
            className="text-link"
            target="_blank"  href="https://myaccount.google.com/apppasswords"
          >
            Generate App Password here!
          </a>
          <br />
          <br />
        </div>

        <div className="mb-4">
          <div className="flex-1 mr-2">
            <label className="label-block">
              Write Your Email Here:
            </label>
            <label className="label-block">Email Subject:</label>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
              className="input-full"
            />
            <br />
            <br />

            <label className="label-block">Email Body:</label>
            <textarea
              rows="5"
              placeholder="Hey {name},Love what you're doing for the {other} business at {company}"
              value={body}
              onChange={handleBodyChange}
              className="input-full"
            />
            <button
              className="button-setup"
              onClick={handleSendEmail}
            >
              Setup Email
            </button>
            
            {error && <p className="error-message">{error}</p>}

            {isSuccessModalOpen && (
              <SuccessModal
                SuccessMessage={successMessage}
                onClose={handleCloseSuccessModal}
              />
            )}
                     
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandlingData;
