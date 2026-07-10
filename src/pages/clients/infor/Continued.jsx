import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaTrash, FaClock, FaFilm, FaTimes } from "react-icons/fa";
import "./Continued.css";
import { ContextWatchHistory } from "../../../contexts/WatchHistoryProvide";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { deleteDocument } from "../../../services/firebaseService";
import { objectById } from "../../../services/reponsitory";

function fmtTime(seconds) {
  const min = Math.floor(seconds / 60);
  if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
  return `${min}m`;
}

export default function Continued() {
  const navigate = useNavigate();
  const allHistory = useContext(ContextWatchHistory);
  const movies = useContext(ContextMovie);
  const { isLogin } = useContext(ContextLogin);

  // ✅ Chỉ lấy lịch sử của đúng tài khoản đang đăng nhập,
  // bỏ những record đã xem gần hết (>=98%) hoặc chưa xem gì (<2%)
  const list = useMemo(() => {
    if (!isLogin?.id) return [];

    return allHistory
      .filter((h) => h.accountId === isLogin.id)
      .map((h) => {
        const movie = objectById(movies, h.movieId);
        if (!movie) return null;

        const progress = Math.min(
          100,
          Math.round((h.watchedSeconds / (h.totalSeconds || 1)) * 100)
        );

        return { ...h, movie, progress };
      })
      .filter((item) => item && item.progress > 2 && item.progress < 98)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [allHistory, movies, isLogin]);

  const handleRemove = async (item) => {
    try {
      await deleteDocument("WatchHistory", { id: item.id });
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  const handleClearAll = async () => {
    for (const item of list) {
      await deleteDocument("WatchHistory", { id: item.id });
    }
  };

  const handlePlay = (item) => {
    navigate(`/table-watch/${item.movieId}`);
  };

  if (!isLogin?.id) {
    return (
      <div className="continued-page">
        <div className="cont-empty">
          <div className="empty-icon">
            <FaFilm size={32} color="rgba(245,197,24,0.25)" />
          </div>
          <p className="empty-text">Vui lòng đăng nhập</p>
          <p className="empty-sub">Đăng nhập để xem danh sách phim bạn đang xem dở</p>
        </div>
      </div>
    );
  }

  return (
    <div className="continued-page">
      <div className="cont-header">
        <div>
          <h2 className="cont-title">Xem Tiếp</h2>
          <p className="cont-subtitle">{list.length} bộ phim đang dang dở</p>
        </div>
        {list.length > 0 && (
          <button className="btn-clear-all" onClick={handleClearAll}>
            <FaTimes size={11} /> Xoá tất cả
          </button>
        )}
      </div>

      {list.length === 0 && (
        <div className="cont-empty">
          <div className="empty-icon">
            <FaFilm size={32} color="rgba(245,197,24,0.25)" />
          </div>
          <p className="empty-text">Chưa có phim nào đang xem dở</p>
          <p className="empty-sub">Bắt đầu xem một bộ phim và nó sẽ xuất hiện ở đây</p>
        </div>
      )}

      <div className="cont-list">
        {list.map((item, idx) => (
          <div
            key={item.id}
            className="cont-card"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div
              className="cont-thumb"
              style={{
                backgroundImage: item.movie.imgUrl
                  ? `url(${item.movie.imgUrl})`
                  : "none",
                backgroundColor: "#0d2137",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="thumb-overlay" />
              {!item.movie.imgUrl && (
                <FaFilm size={22} color="rgba(255,255,255,0.15)" />
              )}
              <div className="thumb-progress-ring">
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="3" />
                  <circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke="#f5c518"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - item.progress / 100)}`}
                    transform="rotate(-90 22 22)"
                  />
                </svg>
                <span className="ring-pct">{item.progress}%</span>
              </div>
            </div>

            <div className="cont-info">
              <div className="cont-meta-top">
                <span className="cont-genre">{item.movie.genre}</span>
                <span className="cont-year">{item.movie.year}</span>
              </div>
              <h3 className="cont-movie-title">{item.movie.name}</h3>
              {item.episodeNumber && (
                <p className="cont-episode">Tập {item.episodeNumber}</p>
              )}

              <div className="cont-progress-wrap">
                <div className="cont-progress-bar">
                  <div className="cont-progress-fill" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="cont-time-row">
                  <span className="time-watched">
                    <FaClock size={10} /> {fmtTime(item.watchedSeconds)} đã xem
                  </span>
                  <span className="time-left">
                    còn {fmtTime(Math.max(0, item.totalSeconds - item.watchedSeconds))}
                  </span>
                </div>
              </div>
            </div>

            <div className="cont-actions">
              <button className="btn-play" onClick={() => handlePlay(item)}>
                <FaPlay size={11} /> Tiếp tục
              </button>
              <button
                className="btn-remove"
                onClick={() => handleRemove(item)}
                title="Xoá khỏi danh sách"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}