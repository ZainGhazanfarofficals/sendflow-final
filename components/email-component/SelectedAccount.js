'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './selectedaccount.css'
import SuccessModal from "./SuccessModal";
import { useSession } from 'next-auth/react';

const SelectedAccount = ({ onAccountSelected }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data:user } = useSession();
  const acc = user?.user?.email;
  console.log("session",acc)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`/api/entries?acc=${acc}`);
        console.log("response",response.data)
        setAccounts(response.data || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (accountId, isChecked) => {
    if (isChecked) {
      // Add account to selectedAccounts
      const accountToAdd = accounts.find(account => account._id === accountId);
      setSelectedAccounts([...selectedAccounts, accountToAdd]);
    } else {
      // Remove account from selectedAccounts
      const filteredAccounts = selectedAccounts.filter(account => account._id !== accountId);
      setSelectedAccounts(filteredAccounts);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the modal
  };

  const handleConfirmSelection = () => {
    // Pass the selected accounts (email and password only) to the parent component
    const selectedAccountDetails = selectedAccounts.map(({ email, appPassword}) => ({ email, appPassword}));
    console.log("detail",selectedAccounts);
    if (typeof onAccountSelected === 'function') {
        
      onAccountSelected(selectedAccountDetails);
      setSuccessMessage('Accounts Selected Successfully!');
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div >
    <label className="account-chooser-label">Choose accounts:</label>
    <div className="account-selection-container">
      {accounts.map(account => (
        <div key={account._id} className="account-checkbox-item">
          <input
            type="checkbox"
            id={`account-${account._id}`}
            onChange={(e) => handleAccountChange(account._id, e.target.checked)}
            checked={selectedAccounts.some(selected => selected._id === account._id)}
            className="account-checkbox-input"
          />
          <label htmlFor={`account-${account._id}`} className="account-checkbox-label">
            {account.name} ({account.email})
          </label>
        </div>
      ))}
    </div>
    <button onClick={handleConfirmSelection} className="confirm-selection-button">
      Confirm Selection
    </button>

    {isSuccessModalOpen && (
      <SuccessModal
        SuccessMessage={successMessage}
        onClose={handleCloseSuccessModal}
      />
    )}

  </div>
  
  
  );
};

export default SelectedAccount;




