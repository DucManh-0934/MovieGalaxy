import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlay,
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
  FaStar,
  FaClock,
  FaFilm,
  FaChevronRight,
} from "react-icons/fa";
import "./TableWatch.css";
import { ContextEpisode } from "../../../contexts/EpisodeProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import MovieComment from "../comment/MovieComment";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextWatchHistory } from "../../../contexts/WatchHistoryProvide";
import { addDocument, updateDocument } from "../../../services/firebaseService";

export default function TableWatch() {
  const navigate = useNavigate();
  const episodes = useContext(ContextEpisode);
  const movies = useContext(ContextMovie);
  const { isLogin } = useContext(ContextLogin);
  const watchHistory = useContext(ContextWatchHistory);
  const { id } = useParams();

  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);

  const showMovie = useMemo(() => {
    if (!episodes || !id) return [];
    return episodes
      .filter((e) => e.movieId === id)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }, [episodes, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPlaying(showMovie[0]);
  }, [showMovie]);

  const movie = useMemo(() => {
    if (!movies || !id) return null;
    return movies.find((e) => e.id === id);
  }, [movies, id]);

  // ✅ Phim liên quan — trùng ít nhất 2 thể loại
  const relatedMovies = useMemo(() => {
    if (!movies || !movie?.listCate?.length) return [];

    return movies
      .filter((m) => {
        if (m.id === movie.id) return false;
        if (!m.listCate?.length) return false;
        const matchCount = m.listCate.filter((cateId) =>
          movie.listCate.includes(cateId)
        ).length;
        return matchCount >= 2;
      })
      .slice(0, 8);
  }, [movies, movie]);

  const nextFilm = (ep) => {
    setPlaying(ep);
    window.scrollTo(0, 0);
  };

  const handleWatchRelated = (movieId) => {
    if (!movieId || movieId === id) return;
    navigate(`/table-watch/${movieId}`);
  };

  // ========== TRACKING TIẾN ĐỘ XEM ==========
  const totalSeconds = useMemo(() => {
    const mins = parseInt(movie?.duration) || 45;
    return mins * 60;
  }, [movie]);

  const watchedSecondsRef = useRef(0);
  const existingRecordIdRef = useRef(null);

  // Khi đổi tập/đổi phim: tìm record cũ (nếu có) để tiếp tục đếm từ đó
  useEffect(() => {
    if (!isLogin?.id || !movie?.id || !playing) return;

    const existing = watchHistory.find(
      (h) =>
        h.accountId === isLogin.id &&
        h.movieId === movie.id &&
        h.episodeId === playing.id
    );

    if (existing) {
      existingRecordIdRef.current = existing.id;
      watchedSecondsRef.current = existing.watchedSeconds || 0;
    } else {
      existingRecordIdRef.current = null;
      watchedSecondsRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id, playing?.id, isLogin?.id]);

  const saveProgress = async () => {
    if (!isLogin?.id || !movie?.id || !playing) return;

    const payload = {
      accountId: isLogin.id,
      movieId: movie.id,
      episodeId: playing.id,
      episodeNumber: playing.episodeNumber,
      watchedSeconds: watchedSecondsRef.current,
      totalSeconds,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (existingRecordIdRef.current) {
        await updateDocument("WatchHistory", {
          id: existingRecordIdRef.current,
          ...payload,
        });
      } else {
        const created = await addDocument("WatchHistory", payload);
        existingRecordIdRef.current = created.id;
      }
    } catch (err) {
      console.error("Lỗi lưu tiến độ xem:", err);
    }
  };

  useEffect(() => {
    if (!isLogin?.id || !playing) return;

    const tickInterval = setInterval(() => {
      if (watchedSecondsRef.current < totalSeconds) {
        watchedSecondsRef.current += 1;
      }
    }, 1000);

    const saveInterval = setInterval(() => {
      saveProgress();
    }, 10000);

    return () => {
      clearInterval(tickInterval);
      clearInterval(saveInterval);
      saveProgress();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing?.id, isLogin?.id, totalSeconds]);
  // ========== HẾT PHẦN TRACKING ==========

  return (
    <div className="tw-page">
      {/* NAV */}
      <div className="tw-nav">
        <button className="tw-nav-back" onClick={() => navigate("/")}>
          <FaArrowLeft size={11} /> Quay lại
        </button>

        <div className="tw-nav-title">
          <span>Đang xem</span>
          <FaChevronRight size={9} />
          <span className="tw-movie-name">{movie?.name}</span>
          <span className="tw-nav-ep-badge">Tập {playing?.episodeNumber}</span>
        </div>

        <div className="tw-nav-actions">
          <button
            className={`tw-btn-action ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <FaHeart size={10} /> {liked ? "Đã thích" : "Yêu thích"}
          </button>
          <button className="tw-btn-action">
            <FaShareAlt size={10} /> Chia sẻ
          </button>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="tw-layout">
        {/* LEFT */}
        <div className="tw-left">
          {/* PLAYER */}
          <div className="tw-player">
            <iframe
              src={playing?.url}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              allowFullScreen
            />
          </div>

          {/* INFO */}
          <div className="tw-info">
            <div>
              <h1 className="tw-title">{movie?.name}</h1>
              <div className="tw-tags">
                <span className="tw-tag tw-tag-genre">{movie?.genre}</span>
                <span className="tw-tag tw-tag-year">{movie?.year}</span>
                <span className="tw-tag tw-tag-rate">
                  <FaStar size={9} /> {movie?.rating}
                </span>
              </div>
              <p className="tw-desc">{movie?.description}</p>
            </div>

            <div className="tw-meta-box">
              {[
                {
                  icon: <FaStar size={12} color="#ffc107" />,
                  label: "Đánh giá",
                  val: `${movie?.rating}/10`,
                },
                {
                  icon: <FaClock size={12} color="#60a5fa" />,
                  label: "Thời lượng",
                  val: movie?.duration,
                },
                {
                  icon: <FaFilm size={12} color="#a78bfa" />,
                  label: "Số tập",
                  val: `${showMovie.length} tập`,
                },
              ].map((item, i) => (
                <div key={i} className="tw-meta-item">
                  {item.icon}
                  <div>
                    <div className="tw-meta-label">{item.label}</div>
                    <div className="tw-meta-val">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EPISODES */}
          <div className="tw-episodes">
            <div className="tw-section-header">
              <div className="tw-section-line" />
              <span className="tw-section-title">Danh sách tập</span>
            </div>
            <div className="tw-ep-list">
              {showMovie.map((ep, i) => (
                <button
                  key={i}
                  className={`tw-ep-btn ${playing?.id === ep.id ? "active" : ""}`}
                  onClick={() => nextFilm(ep)}
                >
                  Tập {ep.episodeNumber}
                </button>
              ))}
            </div>
          </div>

          {/* COMMENT */}
          <MovieComment movieId={id} currentAccount={isLogin} />
        </div>

        {/* SIDEBAR */}
        <div className="tw-sidebar">
          <div className="tw-sidebar-inner">
            <div className="tw-poster">
              <img src={movie?.imgUrl} alt="poster" />
            </div>

            <div className="tw-section-header">
              <div className="tw-section-line" />
              <span className="tw-section-title">Phim liên quan</span>
            </div>
            <div className="tw-related-list">
              {relatedMovies.length > 0 ? (
                relatedMovies.map((r) => (
                  <div
                    key={r.id}
                    className="tw-related-card"
                    onClick={() => handleWatchRelated(r.id)}
                  >
                    <div className="tw-related-thumb">
                      <img src={r.imgUrl} alt={r.name} />
                      <div className="tw-related-overlay">
                        <FaPlay size={12} color="#fff" />
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="tw-related-name">{r.name}</div>
                      <div className="tw-related-ep">
                        {r.episodes?.length
                          ? `${r.episodes.length} tập`
                          : r.year}
                      </div>
                      <div className="tw-related-rating">
                        <FaStar size={9} /> {r.rating}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Chưa có phim liên quan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}