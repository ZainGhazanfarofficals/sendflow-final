"use client"

import React, { useState, useEffect } from "react";
import CreateCampaign from "./CreateCampaigns";

const UpdateCampaign = ({ campaign }) => {
  const [id, setid] = useState(campaign._id);
  const [email, setEmail] = useState(campaign.email);
  const [appPassword, setAppPassword] = useState(campaign.appPassword);
  const [file, setfile] = useState(campaign.excelFile);
  const [subject, setSubject] = useState(campaign.subject);
  const [body, setBody] = useState(campaign.body);
  const [schedule, setSchedule] = useState(campaign.schedulingData);

  return (
    <>
      <CreateCampaign
        id={id}
        setid={setid}
        email={email}
        setEmail={setEmail}
        appPassword={appPassword}
        setAppPassword={setAppPassword}
        file={file}
        setfile={setfile}
        subject={subject}
        setSubject={setSubject}
        body={body}
        setBody={setBody}
        schedule={schedule}
        setSchedule={setSchedule}
      />
    </>
  );
};

export default UpdateCampaign;
