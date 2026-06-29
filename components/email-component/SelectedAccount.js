'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Accounts</p>
          <p className="text-sm text-slate-200">Select additional sender accounts to rotate.</p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 max-h-60 overflow-auto">
        {accounts.map((account) => (
          <label
            key={account._id}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-white/10"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-400"
              onChange={(e) => handleAccountChange(account._id, e.target.checked)}
              checked={selectedAccounts.some((selected) => selected._id === account._id)}
            />
            <span className="font-semibold">{account.email}</span>
          </label>
        ))}
        {accounts.length === 0 && (
          <div className="text-xs text-slate-300">No additional accounts found. Add accounts first.</div>
        )}
      </div>

      <button
        onClick={handleConfirmSelection}
        className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
      >
        Confirm selection
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



