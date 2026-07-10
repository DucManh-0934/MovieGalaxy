import React, { useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextPlan } from "../../../contexts/PlanProvide";
import { objectById } from "../../../services/reponsitory";
import "./RentMovieBuy.css";

function RentMovieBuy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movies = useContext(ContextMovie);
  const plans = useContext(ContextPlan);

  const movie = movies?.find((m) => m.id === id);

  const moviePlan = useMemo(
    () => objectById(plans || [], movie?.planId),
    [plans, movie]
  );

  const minLevel = Number(moviePlan?.level || 1);

  // Level 2+ mới cho thuê lẻ
  const canRentSingle = minLevel >= 2;

  const eligiblePlans = useMemo(
    () =>
      (plans || [])
        .filter((p) => Number(p.level) >= minLevel)
        .sort((a, b) => Number(a.level) - Number(b.level)),
    [plans, minLevel]
  );

  const priceRent = movie?.priceRent
    ? Number(movie.priceRent).toLocaleString("vi-VN") + "đ"
    : "20.000đ";

  const COMBOS = useMemo(() => [
    // Thuê lẻ chỉ xuất hiện nếu level >= 2
    ...(canRentSingle
      ? [
          {
            id: "phim-le",
            name: "Phim Lẻ",
            price: priceRent,
            badge: "Lựa chọn bình dân nhất",
            desc: [
              "Thời hạn 3 ngày.",
              "Đã bao gồm phim bạn đang chọn thuê.",
              "Xem không giới hạn số lần trong thời hạn.",
            ],
            planId: null,
          },
        ]
      : []),

    // Các gói VIP đủ điều kiện
    ...eligiblePlans.map((p) => ({
      id: p.id,
      name: p.title,
      price: Number(p.price).toLocaleString("vi-VN") + "đ / tháng",
      badge:
        Number(p.level) === minLevel
          ? "Phù hợp với phim này"
          : "Lựa chọn tốt nhất",
      desc: [
        `Thời hạn ${p.months || 1} tháng, gia hạn tự động.`,
        "Đã bao gồm phim bạn đang chọn thuê.",
        "Xem phim không giới hạn với hơn 10.000 giờ nội dung đặc sắc.",
      ],
      planId: p.id,
    })),
  ], [eligiblePlans, priceRent, minLevel, canRentSingle]);

  const [selected, setSelected] = useState(() => COMBOS[0]?.id || "");

  const selectedCombo = COMBOS.find((c) => c.id === selected);

  if (!movies || !plans) return <div className="pay-loading">Đang tải...</div>;
  if (!movie) return <div className="pay-loading">Không tìm thấy phim.</div>;

  const handleContinue = () => {
    if (selectedCombo?.planId) {
      navigate(`/buy-pack/${selectedCombo.planId}`);
    } else {
      navigate("/check-out/", {
        state: {
          movieId: id,
          movieName: movie.name,
          plan: selected,
          price: priceRent,
        },
      });
    }
  };

  return (
    <div className="pay-wrap">
      <p className="pay-eyebrow">Bạn đang chọn thuê</p>
      <h1 className="pay-title">Phương thức thanh toán</h1>

      {/* ── TÊN PHIM + GIÁ ── */}
      <p className="section-label">Phim</p>
      <div className="movie-row">
        <span className="movie-row__name">{movie.name}</span>
        {canRentSingle && (
          <span className="movie-row__price">{priceRent}</span>
        )}
      </div>

      {/* Badge level yêu cầu */}
      {!canRentSingle && (
        <div className="plan-notice">
          👑 Phim này chỉ xem được qua gói đăng ký — không hỗ trợ thuê lẻ
        </div>
      )}

      <div className="divider-label">
        <span>
          {canRentSingle ? "Tiết kiệm hơn với Combo" : "Chọn gói phù hợp"}
        </span>
      </div>

      {/* ── DANH SÁCH COMBO ── */}
      <p className="section-label">
        {canRentSingle ? "Gói thuê bao" : "Gói đăng ký"}
      </p>

      {COMBOS.map((combo) => (
        <div
          key={combo.id}
          className={`combo-card ${selected === combo.id ? "selected" : ""}`}
          onClick={() => setSelected(combo.id)}
        >
          <span className="combo-badge">{combo.badge}</span>
          <div className="combo-header">
            <div className="combo-row-top">
              <div
                className={`radio-circle ${selected === combo.id ? "checked" : ""}`}
              >
                {selected === combo.id && <div className="radio-dot" />}
              </div>
              <span className="combo-name">{combo.name}</span>
            </div>
            <span className="combo-price">{combo.price}</span>
          </div>
          <p className="combo-desc">{combo.desc.join(" ")}</p>
        </div>
      ))}

      {/* ── NÚT TIẾP TỤC ── */}
      <button className="btn-next" onClick={handleContinue}>
        {selectedCombo?.planId ? "Đăng ký ngay" : "Tiếp tục"}
      </button>

      <span className="skip-link" onClick={() => navigate("/rent-movie")}>
        Xem kho phim và thanh toán sau
      </span>
    </div>
  );
}

export default RentMovieBuy;