import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaClock, FaFilm, FaRedo } from "react-icons/fa";
import { ContextRent } from "../../../contexts/RentProvide";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import "./FilmRent.css";

// Tính trạng thái thời gian còn lại của 1 lượt thuê
function getTimeStatus(expiryDate, now) {
  const expiry = new Date(expiryDate).getTime();
  const diff = expiry - now;

  if (!expiryDate || isNaN(expiry) || diff <= 0) {
    return { expired: true, label: "Đã hết hạn", tone: "expired" };
  }

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

  const label =
    days > 0
      ? `Còn ${days} ngày ${hours} giờ`
      : hours > 0
      ? `Còn ${hours} giờ ${minutes} phút`
      : `Còn ${minutes} phút`;

  // Sắp hết hạn: dưới 24 giờ -> cảnh báo
  const tone = diff < 24 * 60 * 60 * 1000 ? "warning" : "active";

  return { expired: false, label, tone };
}

function FilmRent() {
  const navigate = useNavigate();
  const rentHistory = useContext(ContextRent);
  const movies = useContext(ContextMovie);
  const { isLogin } = useContext(ContextLogin);

  // Cập nhật đếm ngược mỗi phút
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Ghép RentHistory của user hiện tại với thông tin phim, gộp trùng movieID
  // (giữ bản ghi có expiryDate mới nhất nếu thuê lại nhiều lần)
  const rentedMovies = useMemo(() => {
    if (!isLogin?.id || !rentHistory?.length) return [];

    const own = rentHistory.filter((r) => r.accountID === isLogin.id);

    const latestByMovie = new Map();
    own.forEach((r) => {
      const prev = latestByMovie.get(r.movieID);
      if (!prev || new Date(r.expiryDate) > new Date(prev.expiryDate)) {
        latestByMovie.set(r.movieID, r);
      }
    });

    return Array.from(latestByMovie.values())
      .map((r) => ({
        rent: r,
        movie: movies?.find((m) => m.id === r.movieID),
      }))
      .filter((item) => item.movie) // bỏ qua nếu phim đã bị xóa khỏi kho
      .sort((a, b) => new Date(a.rent.expiryDate) - new Date(b.rent.expiryDate));
  }, [rentHistory, movies, isLogin]);

  const handleClick = (item) => {
    const { expired } = getTimeStatus(item.rent.expiryDate, now);
    if (expired) {
      navigate(`/rent-movie-buy/${item.movie.id}`);
    } else {
      navigate(`/table-watch/${item.movie.id}`);
    }
  };

  return (
    <div className="fr-page">
      {/* ── HEADER ── */}
      <div className="fr-header">
        <p className="fr-eyebrow">Kho phim của bạn</p>
        <h1 className="fr-title">Phim đã thuê</h1>
        <div className="fr-underline" />
      </div>

      {/* ── NOT LOGGED IN ── */}
      {!isLogin && (
        <EmptyState
          icon="🔒"
          text="Đăng nhập để xem các phim bạn đã thuê"
          actionLabel="Đăng nhập"
          onAction={() => navigate("/login")}
        />
      )}

      {/* ── EMPTY ── */}
      {isLogin && rentedMovies.length === 0 && (
        <EmptyState
          icon="🎬"
          text="Bạn chưa thuê bộ phim nào"
          actionLabel="Khám phá kho phim thuê"
          onAction={() => navigate("/rent-movie")}
        />
      )}

      {/* ── GRID ── */}
      {rentedMovies.length > 0 && (
        <div className="fr-grid">
          {rentedMovies.map((item) => {
            const status = getTimeStatus(item.rent.expiryDate, now);

            return (
              <div
                key={item.rent.id || item.movie.id}
                className="fr-card"
                onClick={() => handleClick(item)}
              >
                <div className="fr-poster-wrap">
                  <img
                    src={item.movie.imgUrl}
                    alt={item.movie.name}
                    className={`fr-poster ${status.expired ? "fr-poster--expired" : ""}`}
                  />
                  <div className="fr-poster-fade" />

                  <div className={`fr-badge fr-badge--${status.tone}`}>
                    <FaClock size={9} />
                    <span>{status.label}</span>
                  </div>

                  <div className="fr-card-bottom">
                    <p className="fr-movie-name">{item.movie.name}</p>

                    <button
                      className={`fr-btn ${status.expired ? "fr-btn--expired" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(item);
                      }}
                    >
                      {status.expired ? <FaRedo size={10} /> : <FaPlay size={10} />}
                      {status.expired ? "Thuê lại" : "Xem ngay"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text, actionLabel, onAction }) {
  return (
    <div className="fr-empty">
      <p className="fr-empty__icon">{icon}</p>
      <p className="fr-empty__text">{text}</p>
      <button className="fr-empty__btn" onClick={onAction}>
        <FaFilm size={12} />
        {actionLabel}
      </button>
    </div>
  );
}

export default FilmRent;