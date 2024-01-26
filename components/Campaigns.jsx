"use client"
import React, { useState, useEffect, useMemo } from "react";
import CreateCampaign from "./CreateCampaigns";
import UpdateCampaign from "./EditCampaignForm";
import RemoveBtn from "./RemoveBtn";
import { useSession } from "next-auth/react";
import './campaign.css'

export default function Campaigns({ setMainTitle }) {
  const [createCampaigns, setCreateCampaigns] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // Added state for selected campaign
  const [isEditClicked, setIsEditClicked] = useState(false);

  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [tableData, setTableData] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [dateInfo, setdateInfo] = useState("");

  const { data: user } = useSession();
  const mail = user?.user?.email;

  const fetchData = async () => {
    try {
  //    const apiUrl = `https://snowflow.devsassemble.com/api/campaign?variableName=${encodeURIComponent(mail)}`;
  const apiUrl = `${process.env.NEXT_PUBLIC_URL}api/campaign?variableName=${encodeURIComponent(mail)}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (response.status === 200) {
        const { campaigns } = await response.json();
        setCampaignData(campaigns);
      } else {
        console.error("Error fetching campaigns:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const campaignList = useMemo(() => {
    return (
      campaignData.length > 0 &&
      !selectedCampaign && (
        <ul>
        {campaignData.map((campaign) => (
          <li key={campaign._id} className="campaign-list-item">
            <div>
              <div className="campaign-details">{campaign.subject}</div>
              <div className="campaign-snippet">{campaign.body.slice(0, 50)}...</div>
            </div>
            <div className="campaign-actions">
              <RemoveBtn id={campaign._id} refreshData={fetchData} />
              <button style= {{    backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "700",  padding: "0.5rem 1rem",  borderRadius: "0.25rem", cursor: "pointer"}} onClick={() => handleEditClick(campaign)}>
                View
              </button>
            </div>
          </li>
        ))}
      </ul>      
      )
    );
  }, [campaignData, selectedCampaign]); 

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign); // Set the selected campaign data
    setIsEditClicked(true); // Set isEditClicked to true
    setCreateCampaigns(false); // Disable create button
  };

  return (
    <div>
      {createCampaigns ? (
        <CreateCampaign
          email={email}
          setEmail={setEmail}
          appPassword={appPassword}
          setAppPassword={setAppPassword}
          tableData={tableData}
          setTableData={setTableData}
          subject={subject}
          setSubject={setSubject}
          body={body}
          setBody={setBody}
          dateInfo={dateInfo}
          setdateInfo={setdateInfo}
        />
      ) : (
        <>
          {!isEditClicked && (
            <button
            className="create-campaign-button"
            onClick={() => setCreateCampaigns(true)}
          >
            Create Campaign
          </button>
          )}
          {campaignList}

          {selectedCampaign && (
            <UpdateCampaign campaign={selectedCampaign} />
          )}
        </>
      )}
    </div>
  );
}
