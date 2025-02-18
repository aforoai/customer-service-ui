import React, { useState, useEffect } from "react";
import OrganizationManager from "./OrganizationManager";
import DivisionManager from "./DivisionManager";
import CustomerManager from "./CustomerManager";
import SubscriptionManager from "./SubscriptionManager"; 
import "../styles.css";
import aforoLogo from "../assets/aforo-logo.png.jpg"; // ✅ Ensure the image is in src/assets

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem("selectedTab") || "organizations";
  });

  useEffect(() => {
    localStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <img src={aforoLogo} alt="We ❤️ Aforo.ai" className="aforo-logo" />
      </div>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <button className={`sidebar-button ${selectedTab === "organizations" ? "active" : ""}`} onClick={() => setSelectedTab("organizations")}>
          Organizations
          </button>
          <button className={`sidebar-button ${selectedTab === "divisions" ? "active" : ""}`} onClick={() => setSelectedTab("divisions")}>
            Divisions
          </button>
          <button className={`sidebar-button ${selectedTab === "customers" ? "active" : ""}`} onClick={() => setSelectedTab("customers")}>
            Customers
          </button>
          <button className={`sidebar-button ${selectedTab === "subscriptions" ? "active" : ""}`} onClick={() => setSelectedTab("subscriptions")}>
            Subscriptions
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {selectedTab === "organizations" && <OrganizationManager />}
          {selectedTab === "divisions" && <DivisionManager />}
          {selectedTab === "customers" && <CustomerManager />}
          {selectedTab === "subscriptions" && <SubscriptionManager />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
