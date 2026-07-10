import React, { useState, useContext } from "react";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { ContextPlan, PlanProvider } from "../../../contexts/PlanProvide";
import { ContextFeatures } from "../../../contexts/FeaturesProvide";
import { Link, useNavigate } from "react-router-dom";

function RegisFeaPack({ onClose }) {
  const [selected, setSelected] = useState("vip");
  const { isLogin } = useContext(ContextLogin);
  const Plan = useContext(ContextPlan);
  const Features = useContext(ContextFeatures);
  const navigate = useNavigate();

  return (
    <div className="rfp-wrap">
      <div className="rfp-bg-glow" />

      {/* Header */}
      <div className="rfp-header">
        <h1 className="rfp-title">Tài Khoản VIP</h1>
        <p className="rfp-subtitle">
          Sở hữu tài khoản vip để có trải nghiệm xem phim tốt hơn
        </p>
      </div>

      {/* User card */}
      <div className="rfp-user-card">
        <img
          src={
            isLogin?.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRywwvNmilhncyvLuJtQuOdLbTGdMK1JSTVpA&s"
          }
          alt="avatar"
          className="rfp-user-avatar"
        />
        <div>
          <div className="rfp-user-name">
            {isLogin?.name || "Người dùng"} 🔥
          </div>
          <span className="rfp-user-tag">Bạn là thành viên miễn phí</span>
        </div>
      </div>

      {/* Section title */}
      <h2 className="rfp-section-title">Nâng cấp tài khoản VIP ngay</h2>

      {/* Plans grid */}
      <div className="rfp-grid">
        {[...Plan]
          .sort((a, b) => a.price - b.price)
          .map((e) => {
            const planFeatures = Features?.filter((f) => f.PlanId === e.id);
            return (
              <div
                key={e.id}
                className={`rfp-card rfp-card--blue ${selected === e.id ? "selected" : ""}`}
                onClick={() => setSelected(e.id)}
              >
                <div className="rfp-card-name">{e.title}</div>
                <div className="rfp-card-price">{e.price}</div>
                <div className="rfp-card-period">/Tháng</div>
                <div className="rfp-card-divider" />
                {planFeatures?.map((f) => (
                  <div key={f.id} className="rfp-feature">
                    <span className="rfp-check rfp-check--blue">✓</span>
                    <span>{f.name}</span>
                  </div>
                ))}

                <div className="rfp-select-ring">
                  <div className="rfp-select-dot" />
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer */}
      <div className="rfp-footer">
        <Link className="rfp-btn" to={`/buy-pack/${selected}`}>Tiếp tục</Link>
        <button className="rfp-skip" onClick={onClose}>
          Xem kho phim và đăng kí sau
        </button>
      </div>
    </div>
  );
}

export default RegisFeaPack;
