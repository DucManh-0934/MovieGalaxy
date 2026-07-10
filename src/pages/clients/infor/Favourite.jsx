import React, { useContext, useState } from "react";
import {
  FaHeart,
  FaPlay,
  FaTrash,
  FaStar,
  FaTimes,
  FaFilm,
  FaSearch,
  FaTh,
  FaList,
} from "react-icons/fa";
import "./Favourite.css";
import { ContextLikes } from "../../../contexts/LikeProvide";
import { objectById } from "../../../services/reponsitory";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { deleteDocument } from "../../../services/firebaseService";
import { useNavigate } from "react-router-dom";
import { ContextCategories } from "../../../contexts/CategoryProvide";
import { ContextLogin } from "../../../contexts/LoginProvide"; // 👈 thêm import

export default function Favourite() {
  const allLikes = useContext(ContextLikes);
  const movies = useContext(ContextMovie);
  const categories = useContext(ContextCategories);
  const { isLogin } = useContext(ContextLogin); // 👈 lấy user hiện tại
  const navigate = useNavigate();
  const [genre, setGenre] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [removing, setRemoving] = useState(null);

  // ✅ Chỉ lấy like của đúng tài khoản đang đăng nhập
  const likes = isLogin?.id
    ? (allLikes ?? []).filter((item) => item.accountId === isLogin.id)
    : [];

  const handleWatch = (movie) => {
    navigate(`/table-watch/${movie.id}`);
  };

  const genreList = [
    "Tất cả",
    ...(categories ?? [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "vi"))
      .map((c) => c.name),
  ];

  const filtered = likes.filter((item) => {
    const movie = objectById(movies, item.movieId);
    if (!movie) return false;

    const matchSearch = (movie.name ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchGenre =
      genre === "Tất cả" ||
      (movie.listCate ?? []).some((cateId) => {
        const cate = objectById(categories, cateId);
        return cate?.name === genre;
      });

    return matchSearch && matchGenre;
  });

  const handleRemove = async (item) => {
    setRemoving(item.id);
    try {
      await deleteDocument("Likes", { id: item.id });
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
    setRemoving(null);
  };

  // ✅ Chưa đăng nhập thì chặn luôn, không hiển thị gì cả
  if (!isLogin?.id) {
    return (
      <div className="fav-page">
        <div className="fav-empty">
          <div className="empty-icon">
            <FaHeart size={28} color="rgba(245,197,24,0.2)" />
          </div>
          <p className="empty-text">Vui lòng đăng nhập</p>
          <p className="empty-sub">
            Đăng nhập để xem danh sách phim yêu thích của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-page">
      {/* Header */}
      <div className="fav-header">
        <div>
          <h2 className="fav-title">
            <FaHeart size={18} className="fav-title-icon" />
            Yêu Thích
          </h2>
          <p className="fav-subtitle">{likes.length} bộ phim</p>
        </div>

        {/* View toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            <FaTh size={13} />
          </button>
          <button
            className={`toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <FaList size={13} />
          </button>
        </div>
      </div>

      {/* Search + genre filter */}
      <div className="fav-controls">
        <div className="fav-search-wrap">
          <FaSearch size={12} className="search-icon" />
          <input
            className="fav-search"
            placeholder="Tìm trong yêu thích..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <FaTimes size={10} />
            </button>
          )}
        </div>

        <div className="genre-filters">
          {genreList.map((g) => {
            const count =
              g === "Tất cả"
                ? likes.length
                : likes.filter((item) => {
                    const movie = objectById(movies, item.movieId);
                    if (!movie) return false;
                    return (movie.listCate ?? []).some((cateId) => {
                      const cate = objectById(categories, cateId);
                      return cate?.name === g;
                    });
                  }).length;
            return (
              <button
                key={g}
                className={`genre-btn ${genre === g ? "active" : ""}`}
                onClick={() => setGenre(g)}
              >
                {g} <span className="genre-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty */}
      {likes.length === 0 && (
        <div className="fav-empty">
          <div className="empty-icon">
            <FaHeart size={28} color="rgba(245,197,24,0.2)" />
          </div>
          <p className="empty-text">
            {search || genre !== "Tất cả"
              ? "Không tìm thấy phim nào"
              : "Chưa có phim yêu thích"}
          </p>
          <p className="empty-sub">
            {search || genre !== "Tất cả"
              ? "Thử tìm kiếm hoặc lọc khác"
              : "Nhấn ♥ khi xem phim để lưu vào đây"}
          </p>
        </div>
      )}

      {/* ...giữ nguyên phần grid view + list view phía dưới, không cần đổi gì... */}
      {view === "grid" && filtered.length > 0 && (
        <div className="fav-grid">
          {filtered.map((item, idx) => {
            const movie = objectById(movies, item.movieId); // 👈 thêm dòng này
            if (!movie) return null; // 👈 guard nếu chưa load

            return (
              <div
                key={item.id}
                className={`fav-grid-card ${removing === item.id ? "removing" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Poster */}
                <div
                  className="grid-poster"
                  style={{
                    backgroundImage: movie.imgUrl
                      ? `url(${movie.imgUrl})`
                      : "none",
                    backgroundColor: movie.color ?? "#0d2137",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="poster-overlay" />
                  {!movie.poster && (
                    <FaFilm size={28} color="rgba(255,255,255,0.1)" />
                  )}

                  {/* Hover actions */}
                  <div className="grid-hover-actions">
                    <button
                      className="grid-btn-play"
                      onClick={() => handleWatch(movie)}
                    >
                      {" "}
                      <FaPlay size={14} />
                    </button>
                  </div>

                  {/* Remove btn */}
                  <button
                    className="grid-btn-remove"
                    onClick={() => handleRemove(item)}
                  >
                    <FaHeart size={12} />
                  </button>

                  {/* Rating */}
                  <div className="grid-rating">
                    <FaStar size={10} color="#f5c518" />
                    <span>{movie.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="grid-info">
                  <p className="grid-title">{movie.name}</p>
                  <p className="grid-meta">
                    {movie.year} · {movie.genre}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* List view */}
      {view === "list" && filtered.length > 0 && (
        <div className="fav-list">
          {filtered.map((item, idx) => {
            const movie = objectById(movies, item.movieId);
            if (!movie) return null;

            return (
              <div
                key={item.id}
                className={`fav-list-card ${removing === item.id ? "removing" : ""}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                {/* Thumb */}
                <div
                  className="list-thumb"
                  style={{
                    backgroundImage: movie.imgUrl
                      ? `url(${movie.imgUrl})`
                      : "none",
                    backgroundColor: movie.color ?? "#0d2137",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!movie.imgUrl && (
                    <div className="list-actions">
                      <button
                        className="list-btn-play"
                        onClick={() => handleWatch(movie)}
                      >
                        {" "}
                        <FaPlay size={11} /> Xem
                      </button>
                      <button
                        className="list-btn-remove"
                        onClick={() => handleRemove(item)}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="list-info">
                  <p className="list-title">{movie.name}</p>
                  <p className="list-meta">
                    {movie.year} · {movie.genre}
                  </p>
                </div>

                {/* Rating */}
                <div className="list-rating">
                  <FaStar size={12} color="#f5c518" />
                  <span>{movie.rating}</span>
                </div>

                {/* Actions */}
                <div className="list-actions">
                  <button
                    className="list-btn-play"
                    onClick={() => handleWatch(movie)}
                  >
                    <FaPlay size={11} /> Xem
                  </button>
                  <button
                    className="list-btn-remove"
                    onClick={() => handleRemove(item)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
