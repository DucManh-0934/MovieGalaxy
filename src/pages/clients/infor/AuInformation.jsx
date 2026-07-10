import React, { useState } from "react";
import "./AuInformation.css";
import { LISTINFOR } from "../../../untils/Contants";
import { Link } from "react-router-dom";

function AuInformation() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div className="sidebar-box">
      <div className="sidebar-header">
        <p className="sidebar-title-label">Tài khoản</p>
        <p className="sidebar-title">Quản lý tài khoản</p>
      </div>
      <nav className="sidebar-nav">
        {LISTINFOR.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`nav-item ${activeItem === index ? "active" : ""}`}
            onClick={() => setActiveItem(index)}
          >
            {item.Icon}
            <span className="nav-label">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default AuInformation;