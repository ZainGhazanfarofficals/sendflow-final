"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import './userinfo.css'

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="user-info-container">
      <div className="user-info-box">
        <div className="user-info-detail">
          Name: <strong>{session?.user?.name}</strong>
        </div>
        <div className="user-info-detail">
          Email: <strong>{session?.user?.email}</strong>
        </div>
        <button
          onClick={() => signOut()}
          className="sign-out-button"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
