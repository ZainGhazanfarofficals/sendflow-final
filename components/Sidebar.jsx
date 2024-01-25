import Link from 'next/link';
import './sidebar.css'

export function Sidebar() {
  return (
    <div className="sidebar-card">
      <div className="sidebar-list">
        <Link className="sidebar-list-item" href="/dashboard/analytics">
             Analytics 
        </Link>
        <Link className="sidebar-list-item" href="/dashboard/accounts">
             Accounts 
        </Link>
        <Link className="sidebar-list-item" href="/dashboard/campaigns">
             Campaigns 
        </Link>
        <Link className="sidebar-list-item" href="/dashboard/mailbox">
         Mailbox
        </Link>
        <Link className="sidebar-list-item" href="/dashboard/settings">
         Settings
        </Link>
      </div>
    </div>
  );
}
