import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardData from "../components/DashboardInfo";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="md:w-56">
        <DashSidebar></DashSidebar>
      </div>
      {/* profile */}
      <div className="flex-1">
        {(tab === "dash" || !tab) && <DashboardData></DashboardData>}
        {tab === "profile" && <DashProfile></DashProfile>}
        {tab === "posts" && <DashPosts></DashPosts>}
        {tab === "users" && <DashUsers></DashUsers>}
        {tab === "comments" && <DashComments></DashComments>}
      </div>
    </div>
  );
};

export default Dashboard;
