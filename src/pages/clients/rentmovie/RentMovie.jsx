import React, { useContext, useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextCategories } from "../../../contexts/CategoryProvide";
import { ContextPlan } from "../../../contexts/PlanProvide";
import { ContextRent } from "../../../contexts/RentProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { objectById } from "../../../services/reponsitory";
import { Link, useNavigate } from "react-router-dom";
import "./RentMovie.css";

function RentMovie() {
  const movies = useContext(ContextMovie);
  const categories = useContext(ContextCategories);
  const plans = useContext(ContextPlan);
  const rentHistory = useContext(ContextRent);
  const { isLogin } = useContext(ContextLogin);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // Tập hợp movieID mà user hiện tại đã thuê và CHƯA hết hạn
  const ownedMovieIds = useMemo(() => {
    if (!isLogin?.id || !rentHistory?.length) return new Set();

    const now = Date.now();
    const ids = rentHistory
      .filter((r) => r.accountID === isLogin.id)
      .filter((r) => {
        const expiry = new Date(r.expiryDate).getTime();
        return !isNaN(expiry) && expiry > now;
      })
      .map((r) => r.movieID);

    return new Set(ids);
  }, [rentHistory, isLogin]);

  // Chỉ lấy phim có plan level >= 2 (cho phép thuê lẻ)
  const rentableMovies = movies?.filter((m) => {
    const plan = plans?.find((p) => p.id === m.planId);
    return Number(plan?.level || 1) >= 2;
  });

  const filtered = rentableMovies?.filter((m) =>
    m.name?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="rent-page">

      {/* ── HEADER ── */}
      <div className="rent-header">
        <p className="rent-header__eyebrow">Kho phim thuê</p>
        <h1 className="rent-header__title">Thuê phim lẻ</h1>
        <p className="rent-header__subtitle">
          Xem một lần, không cần đăng ký gói. Trả tiền theo từng bộ phim.
        </p>

        {/* ── SEARCH ── */}
        <div className="rent-search">
          <FaMagnifyingGlass className="rent-search__icon" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tên phim..."
            className="rent-search__input"
          />
        </div>
      </div>

      {/* ── MOVIE GRID ── */}
      <div className="rent-grid-wrapper">
        {filtered?.length === 0 ? (
          <div className="rent-empty">
            <p className="rent-empty__icon">🎬</p>
            <p className="rent-empty__text">Không tìm thấy phim nào</p>
          </div>
        ) : (
          <div className="rent-grid">
            {filtered?.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                categories={categories}
                isOwned={ownedMovieIds.has(movie.id)}
                onWatch={() => navigate(`/table-watch/${movie.id}`)}
                onGoToLibrary={() => navigate("/auinformation/filmrent")}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── VIP PLANS SECTION ── */}
      <div className="rent-plans-section">
        <div className="rent-plans-header">
          <p className="rent-header__eyebrow">Hoặc xem không giới hạn</p>
          <h2 className="rent-plans-title">Đăng ký gói VIP</h2>
          <p className="rent-header__subtitle">
            Xem toàn bộ thư viện phim với một mức giá cố định mỗi tháng.
          </p>
        </div>

        <div className="rent-plans-grid">
          {plans?.map((plan) => (
            <div key={plan.id} className="rent-plan-card">
              <div className="rent-plan-card__top">
                <p className="rent-plan-card__name">👑 {plan.title}</p>
                <p className="rent-plan-card__price">
                  {Number(plan.price).toLocaleString("vi-VN")}
                  <span>đ / tháng</span>
                </p>
              </div>
              <Link
                to={`/buy-pack/${plan.id}`}
                className="rent-plan-card__btn"
              >
                Mua ngay
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MovieCard({ movie, categories, isOwned, onWatch, onGoToLibrary }) {
  const cateNames = movie.listCate
    ?.map((id) => objectById(categories, id)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");

  const price = movie.priceRent
    ? Number(movie.priceRent).toLocaleString("vi-VN") + "đ"
    : "Liên hệ";

  return (
    <div className="movie-card">

      {/* ── POSTER ── */}
      <div className="movie-card__poster">
        <img src={movie.imgUrl} alt={movie.name} className="movie-card__img" />

        {/* Badge: đã thuê thì hiện "Đã thuê", ngược lại hiện giá */}
        <div className={`movie-card__badge ${isOwned ? "movie-card__badge--owned" : ""}`}>
          {isOwned ? "✔ Đã thuê" : price}
        </div>

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <button
            className="movie-card__btn-watch"
            onClick={(e) => { e.stopPropagation(); onWatch(); }}
          >
            ▶ Xem thử
          </button>

          {isOwned ? (
            <button
              className="movie-card__btn-rent movie-card__btn-rent--owned"
              onClick={(e) => { e.stopPropagation(); onGoToLibrary(); }}
            >
              🎬 Đã thuê · Xem trong kho
            </button>
          ) : (
            <Link
              to={`/rent-movie-buy/${movie.id}`}
              className="movie-card__btn-rent"
              onClick={(e) => e.stopPropagation()}
            >
              🎬 Thuê · {price}
            </Link>
          )}
        </div>
      </div>

      {/* ── INFO ── */}
      <div className="movie-card__info">
        <p className="movie-card__name">{movie.name}</p>
        <p className="movie-card__meta">
          {cateNames || "Phim lẻ"} · {movie.duration} phút
        </p>
      </div>

    </div>
  );
}

export default RentMovie;