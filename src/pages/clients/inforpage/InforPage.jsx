import React from "react";
import AuInformation from "../infor/AuInformation";
import { Outlet } from "react-router-dom";
import "./InforPage.css";

function InforPage() {
  return (
    <div className="infor-page">
      <aside className="infor-sidebar">
        <AuInformation />
      </aside>
      <main className="infor-content">
        <Outlet />   {/* ← Outlet đặt ở đây */}
      </main>
    </div>
  );
}

export default InforPage;