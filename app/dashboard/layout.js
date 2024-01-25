import { Sidebar } from "@/components/Sidebar";
import "./layout.css";

export default function DashboardLayout({
  children,
  setSidebarTitle,
  setCampaignsKey,
}) {
  return (
    <section className="dashboardContainer">
      <Sidebar setSidebarTitle={setSidebarTitle} setCampaignsKey={setCampaignsKey} />

      <div className="cardContainer">
        <div className="card">
          <div className="cardBody">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
