"use client";

import React, { useState, useEffect, useMemo } from "react";
import CreateCampaign from "./CreateCampaigns";
import UpdateCampaign from "./EditCampaignForm";
import RemoveBtn from "./RemoveBtn";
import { useSession } from "next-auth/react";

export default function Campaigns() {
  const [createCampaigns, setCreateCampaigns] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [tableData, setTableData] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [dateInfo, setdateInfo] = useState("");

  const { data: user } = useSession();
  const mail = user?.user?.email;

  const fetchData = async () => {
    setLoading(true);
    if (!mail) return;
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}api/campaign?variableName=${encodeURIComponent(mail)}`;
      const response = await fetch(apiUrl, { method: "GET" });
      if (response.status === 200) {
        const { campaigns } = await response.json();
        setCampaignData(campaigns);
      } else {
        console.error("Error fetching campaigns:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mail]);

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditClicked(true);
    setCreateCampaigns(false);
  };

  const campaignList = useMemo(() => {
    if (selectedCampaign) return null;
    if (loading) {
      return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse" />
          ))}
        </div>
      );
    }
    if (campaignData.length === 0) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-100">
          <p className="text-lg font-semibold">No campaigns yet</p>
          <p className="text-sm text-slate-300">Create your first campaign to get started.</p>
          <button
            className="mt-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            onClick={() => {
              setCreateCampaigns(true);
              setIsEditClicked(false);
            }}
          >
            New campaign
          </button>
        </div>
      );
    }
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {campaignData.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-lg backdrop-blur"
          >
            <div className="text-sm uppercase tracking-[0.12em] text-emerald-300">Campaign</div>
            <div className="mt-1 text-lg font-semibold line-clamp-1">{campaign.subject}</div>
            <div className="mt-1 text-xs text-slate-300 line-clamp-2">{campaign.body}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <RemoveBtn id={campaign.id} refreshData={fetchData} />
              <button
                className="rounded-lg border border-blue-400/40 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 hover:bg-blue-500/30"
                onClick={() => handleEditClick(campaign)}
              >
                View / Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [campaignData, selectedCampaign, loading]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Campaigns</p>
          <h2 className="text-xl font-semibold text-slate-50">Manage & launch campaigns</h2>
        </div>
        {!isEditClicked && (
          <button
            className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            onClick={() => setCreateCampaigns(true)}
          >
            Create Campaign
          </button>
        )}
      </div>

      {!createCampaigns && !selectedCampaign && (
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-50 shadow-lg md:grid-cols-4">
          <div>
            <div className="text-lg font-bold">{campaignData.length}</div>
            <div className="text-xs text-slate-300">Total campaigns</div>
          </div>
          <div>
            <div className="text-lg font-bold">{campaignData.filter((c) => c.schedulingData).length}</div>
            <div className="text-xs text-slate-300">Scheduled</div>
          </div>
          <div>
            <div className="text-lg font-bold">{campaignData.filter((c) => c.excelFile).length}</div>
            <div className="text-xs text-slate-300">With lead files</div>
          </div>
          <div>
            <div className="text-lg font-bold">Live</div>
            <div className="text-xs text-emerald-300">Status healthy</div>
          </div>
        </div>
      )}

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
          {campaignList}
          {selectedCampaign && <UpdateCampaign campaign={selectedCampaign} />}
        </>
      )}
    </div>
  );
}
