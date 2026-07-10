import React, { useState } from "react";
import {
  FaBell, FaFilm, FaStar, FaTag, FaGift,
  FaCheck, FaTrash, FaTimes, FaCheckDouble
} from "react-icons/fa";
import "./Notification.css";

const MOCK_NOTIFS = [
  {
    id: 1, type: "new_episode", unread: true,
    title: "Tập mới vừa ra!",
    desc: "Attack on Titan S4 E29 — Tử Thần và Thiếu Niên đã có mặt.",
    time: "2 phút trước",
    color: "#c0392b",
  },
  {
    id: 2, type: "recommend", unread: true,
    title: "Gợi ý hôm nay",
    desc: "Dựa trên lịch sử xem của bạn — Oppenheimer có thể bạn sẽ thích.",
    time: "1 giờ trước",
    color: "#1a3a5c",
  },
  {
    id: 3, type: "promo", unread: true,
    title: "Ưu đãi đặc biệt 🎁",
    desc: "Nâng cấp Premium hôm nay, giảm 50% cho 3 tháng đầu.",
    time: "3 giờ trước",
    color: "#2a1a0a",
  },
  {
    id: 4, type: "review", unread: false,
    title: "Đánh giá của bạn được thích",
    desc: "12 người thấy review Inception của bạn hữu ích.",
    time: "Hôm qua",
    color: "#1a2a1a",
  },
  {
    id: 5, type: "new_episode", unread: false,
    title: "Phim mới thêm vào",
    desc: "Dune: Part Two đã có trên MovieGalaxy. Xem ngay!",
    time: "2 ngày trước",
    color: "#1a1a2a",
  },
  {
    id: 6, type: "promo", unread: false,
    title: "Sự kiện cuối tuần",
    desc: "Marathon phim Marvel toàn bộ 30 phim — miễn phí cuối tuần này.",
    time: "3 ngày trước",
    color: "#2a0a1a",
  },
];

const TYPE_ICON = {
  new_episode: <FaFilm size={15} />,
  recommend:   <FaStar size={15} />,
  promo:       <FaGift size={15} />,
  review:      <FaCheckDouble size={15} />,
};

const TYPE_COLOR = {
  new_episode: "#f5c518",
  recommend:   "#4ab3f4",
  promo:       "#f5a623",
  review:      "#4cd97b",
};

const FILTERS = ["Tất cả", "Chưa đọc", "Phim mới", "Ưu đãi"];

export default function Notification() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [filter, setFilter] = useState("Tất cả");
  const [removing, setRemoving] = useState(null);

  const unreadCount = notifs.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifs((n) => n.map((item) => ({ ...item, unread: false })));
  }

  function markRead(id) {
    setNotifs((n) => n.map((item) => item.id === id ? { ...item, unread: false } : item));
  }

  function remove(id) {
    setRemoving(id);
    setTimeout(() => {
      setNotifs((n) => n.filter((item) => item.id !== id));
      setRemoving(null);
    }, 350);
  }

  const filtered = notifs.filter((n) => {
    if (filter === "Chưa đọc") return n.unread;
    if (filter === "Phim mới")  return n.type === "new_episode";
    if (filter === "Ưu đãi")    return n.type === "promo";
    return true;
  });

  return (
    <div className="notif-page">
      {/* Header */}
      <div className="notif-header">
        <div>
          <h2 className="notif-title">
            Thông Báo
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </h2>
          <p className="notif-subtitle">{notifs.length} thông báo</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-mark-all" onClick={markAllRead}>
            <FaCheck size={11} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="notif-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f === "Chưa đọc" && unreadCount > 0 && (
              <span className="tab-count">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="notif-empty">
          <div className="empty-icon">
            <FaBell size={28} color="rgba(245,197,24,0.2)" />
          </div>
          <p className="empty-text">Không có thông báo nào</p>
        </div>
      )}

      {/* List */}
      <div className="notif-list">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className={`notif-card ${item.unread ? "unread" : ""} ${removing === item.id ? "removing" : ""}`}
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => markRead(item.id)}
          >
            {/* Unread dot */}
            {item.unread && <span className="unread-dot" />}

            {/* Icon */}
            <div
              className="notif-icon-wrap"
              style={{
                background: `${TYPE_COLOR[item.type]}18`,
                border: `1px solid ${TYPE_COLOR[item.type]}33`,
                color: TYPE_COLOR[item.type],
              }}
            >
              {TYPE_ICON[item.type]}
            </div>
            <div className="notif-content">
              <p className="notif-card-title">{item.title}</p>
              <p className="notif-card-desc">{item.desc}</p>
              <span className="notif-time">{item.time}</span>
            </div>

            {/* Remove */}
            <button
              className="btn-notif-remove"
              onClick={(e) => { e.stopPropagation(); remove(item.id); }}
              title="Xoá"
            >
              <FaTimes size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}