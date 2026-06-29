"use client";
import React, { useState } from "react";
import HandlingData from "components/email-component/HandlingData";
import ExcelImport from "components/email-component/ExcelImport";
import Schedule from "components/email-component/Schedule";
import SuccessModal from "components/email-component/SuccessModal";
import FailedModal from "components/email-component/FailedModal";
import SelectedAccount from "components/email-component/SelectedAccount";
import axios from "axios";
import Analytics from "components/email-component/Analytics";
import { useSession } from "next-auth/react";

function CreateCampaign({
  email,
  MultiEmail,
  setEmail,
  appPassword,
   MultiAppPassword,
  setAppPassword,
  subject,
  setSubject,
  body,
  setBody,
  tableData,
  setTableData,
  dateInfo,
  setdateInfo,
  file,
  setfile,
  setSchedule,
  schedule,
  id,
  setid,
})
   {
    const { data:user } = useSession();
    const mail = user.user.email;

  const [cid,setcid] = useState("");
 const [activeTab, setActiveTab] = useState("Email");
 const [additionalAccounts, setAdditionalAccounts] = useState([]);
 const [filename, setfilename] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [FailedMessage, setFailedMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  
  const handleTabClick = (tabName) => setActiveTab(tabName);

  const tabMeta = {
    Analytics: {
      title: "Performance",
      desc: "Track opens, replies, and outcomes for this campaign.",
    },
    Email: {
      title: "Email content",
      desc: "Craft the subject and body your prospects will see.",
    },
    Leads: {
      title: "Recipients",
      desc: "Upload or review the lead list for this send.",
    },
    Schedule: {
      title: "Timing",
      desc: "Choose when your messages should go out.",
    },
    Others: {
      title: "Accounts",
      desc: "Add additional sender accounts to rotate and warm.",
    },
  };
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the modal
  };

  const handleCloseFailedModal = () => {
    setIsFailedModalOpen(false); // Close the modal
  };

  const handleSelectedAccounts = (selectedAccounts) => {
    console.log("selected accounts:",selectedAccounts)
    // You can now combine the accounts with the existing email and password
    const combinedAccounts = [
      // If there's already an email and password, include them as the first account
      ...(MultiEmail && MultiAppPassword ? [{ MultiEmail, MultiAppPassword }] : []),
      // Add the selected accounts
      ...selectedAccounts,
    ];

    setAdditionalAccounts(combinedAccounts);
    console.log('Updated list of accounts:', combinedAccounts);
  };
  
  const sendEmailDataToApi = async (e) => {
    e.preventDefault();
  
  
    // Check for missing or empty fields
    if (!email || !appPassword || !subject || !body || !dateInfo || tableData.length === 0) {
      setError('Please fill in all required fields.');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }

    const scheduled = dateInfo;
    // keep a local campaign id that we can pass to api_four
    let campaignId = id;

    try {
      
      const authResponse = await axios.post('/api/auth', {
        email,
        appPassword,
      });

      if (authResponse.status === 200) {
        setError('');
        setSuccessMessage('Authentication Approved.');
        setIsSuccessModalOpen(true);
      } else {
        setFailedMessage("Email Not Sent. Authenticate Yourself Again")
        setIsFailedModalOpen(true);
        return;
      }
      if (additionalAccounts.length > 0) {
        console.log("Additional accounts are:", additionalAccounts)
        // Authenticate the additional accounts
        const additionalAuthResults = await Promise.all(
          additionalAccounts.map(account => 
            axios.post('/api/auth', {
              email: account.email,
              appPassword: account.appPassword,
            })
            .then(response => ({ ...account, authResult: response.data }))
            .catch(error => ({ ...account, error }))
          )
        );
      
        // Check if all additional accounts were authenticated successfully
        const allAuthSuccess = additionalAuthResults.every(account => account.authResult);
      
        if (allAuthSuccess) {
          setError('');
          setSuccessMessage('Authentication Approved for Additional Accounts');
          setIsSuccessModalOpen(true);
        } else {
          const failedAccounts = additionalAuthResults.filter(account => !account.authResult);
          // Handle failed authentications, possibly listing the accounts that failed
          setFailedMessage(`Authentication failed for some accounts: ${failedAccounts.map(acc => acc.email).join(', ')}`);
          setIsFailedModalOpen(true);
          return; // Stop the process if any authentication fails
        }
      } else {
        // If there are no additional accounts, you can skip this step or handle accordingly
        console.log('No additional accounts to authenticate');
      }

       console.log("filename",filename);
      const res = await axios.post('/api/campaign', {
        subject,
        body,
        email,
        appPassword,
        excelFile: filename,
        schedulingData: scheduled,
        mail
      })

      if (res.status === 200) {
        // Next.js app router returns `campaign.id` (Prisma id). Support legacy `_id` just in case.
        campaignId = res.data?.campaign?.id || res.data?.campaign?._id;
        if (!campaignId) throw new Error('Campaign id missing from /api/campaign response');

        setid?.(campaignId);      // update parent state if provided
        setcid(campaignId);       // local state (for UI)

        setError('');
        setSuccessMessage('Campaign Stored successfully.');
        setIsSuccessModalOpen(true);
        console.log("successful", campaignId);
      } else {
        console.error('Campaign failed.');
      }

      
      // Send data to the first API endpoint
      const response1 = await axios.post('/api/api_four', {
        subject,
        body,
        email,
        additionalAccounts,
        appPassword,
        data: tableData,
        dateInfo,
        id: campaignId,
        mail
      });
  
      if (response1.status === 200) {
        setError('');
        setSuccessMessage('Campaign Sent successfully.');
        setIsSuccessModalOpen(true);
      } else {
        console.error('Error:', response1.data);
        setError('An error occurred while sending data.');
        setTimeout(() => {
          setError('');
        }, 2000);
      }


  

     } catch (error) {
      console.error('Error:', error);
      setFailedMessage("Email Not Sent. Authenticate Yourself Again")
      setIsFailedModalOpen(true);
    
    }
  };
  

    const dateInfofun = (date) =>{
      
      if (!date) {
        setError("Please Give Date & Time");
        return;
      }
      
      setdateInfo(date)
      
      console.log('Date & time received in CreateCampaign:', date);
    }

    const handleSendEmail = (emailData) => {
      const { email, appPassword, subject, body } = emailData;
      if (!email || !appPassword || !subject || !body) {
        setError("Please fill in all required fields.");
        return;
      }
      setEmail(email);
      setAppPassword(appPassword);
      setBody(body);
      setSubject(subject);
    };
  

    const handleTableDataChange = (tableData, uploadedFilename) => {
      if (tableData.length === 0) {
        setError("Please Upload File");
        return;
      }
      console.log(uploadedFilename);
      // Implement your logic here to handle the table data
      setTableData(tableData);
      setfilename(uploadedFilename);
      console.log('Table data received in CreateCampaign:', tableData);
      console.log('Uploaded filename:', uploadedFilename);
    
      // Now you can use the uploadedFilename in your logic as needed
    };

  const renderCreateButton = () => {
    if (activeTab === 'Email') {
      return (
        <button
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
          onClick={sendEmailDataToApi}
        >
          Send campaign
        </button>
      );
    } else {
      return null; // Hide the button for other tabs
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <Analytics id={id} cid={cid}/>;
      case 'Email':
        return <HandlingData onSendEmail={handleSendEmail}
         email={email} // Pass email as prop
        appPassword={appPassword} // Pass appPassword as prop
        subject={subject} // Pass subject as prop
        body={body} />;

      case 'Leads':
        return <div ><ExcelImport onTableDataChange={(tableData,filenameFromResponse) => handleTableDataChange(tableData, filenameFromResponse)} tableData={tableData} file={file}/> </div>;
      case 'Schedule':
        return <Schedule takedateInfo={dateInfofun}  dateInfo={dateInfo} schedule={schedule}/>;
      case 'Others':
        return <div><SelectedAccount onAccountSelected={handleSelectedAccounts}  /></div>;
      default:
        return null;
    }
  };


  return (
  
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Create</p>
          <h2 className="text-xl font-semibold">Build your campaign</h2>
        </div>
        <div className="inline-flex gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          <span>Steps:</span>
          <span className="font-semibold text-emerald-300">Email → Leads → Schedule → Accounts → Analytics</span>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-50 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {["Email", "Leads", "Schedule", "Others", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-emerald-400 text-slate-900 shadow-lg"
                  : "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{tabMeta[activeTab]?.title}</p>
            <p className="text-sm text-slate-200">{tabMeta[activeTab]?.desc}</p>
          </div>
          <div className="pt-2">{renderTabContent()}</div>
        </div>

        <div className="flex justify-end">
          <div className="send-button-container">{renderCreateButton()}</div>
        </div>

        {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}

        {isSuccessModalOpen && (
          <SuccessModal
            SuccessMessage={successMessage}
            onClose={handleCloseSuccessModal}
          />
        )}

        {isFailedModalOpen && (
          <FailedModal
            FailedMessage={FailedMessage}
            onClose={handleCloseFailedModal}
          />
        )}
      </div>
    </div>
  );
}

export default CreateCampaign;
