"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import './navbar.css'


export default function Navbar({session}) {
  useEffect(() => {
  }, []);
  const  handleSignOut =async ()=>{
      await signOut();
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="logo-container" href="/">
            <Image
              src="https://res.cloudinary.com/dpkkaacjk/image/upload/v1693990468/text-1674847270073_gshlaz.png"
              alt="Send Flow"
              width={100}
              height={50}
            />
        </Link>
        <div className="session-container">
          {session !== null ? (
            <div className="session-actions">
              <button onClick={handleSignOut} className="sign-out-button">
                Sign Out
              </button>
              {session?.user?.image && (
                <Image
                  className="user-image"
                  src={session?.user?.image}
                  alt=""
                  width={50}
                  height={50}
                />
              )}
              <div>
                <span className="user-name">{session?.user?.name}</span>
              </div>
            </div>
          ) : (
            <Link className="get-started-button" href="/login">
                 Get Started
            </Link>
          )}
        </div>
        <div className="menu-list" id="navbar-sticky">
          <ul className="nav-menu">
            <li>
              <Link className="menu-list-item" href="#">
                   DOCS
              </Link>
            </li>
            <li>
              <Link className="menu-list-item" href="#">
                  FAQs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}