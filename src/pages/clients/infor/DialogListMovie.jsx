import React, { useContext, useEffect, useRef } from "react";
import { FaTimes, FaPlay, FaFilm, FaTrash, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { objectById } from "../../../services/reponsitory";
import { updateDocument } from "../../../services/firebaseService";

export default function DialogListMovie({
  playlist,
  onClose,
  onRemoveMovie,
  showToast,
}) {
  const movies = useContext(ContextMovie);
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const savedMovies = (playlist?.movies ?? [])
    .map((id) => objectById(movies, id))
    .filter(Boolean);

  // Đóng khi click overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Đóng khi nhấn Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Xoá phim khỏi playlist
  const handleRemove = async (movieId) => {
    try {
      const updatedMovies = (playlist.movies ?? []).filter(
        (id) => id !== movieId,
      );
      await updateDocument("playlists", {
        id: playlist.id,
        movies: updatedMovies,
        count: updatedMovies.length,
      });
      if (onRemoveMovie) onRemoveMovie(movieId);
      if (showToast) showToast("Đã xoá phim khỏi danh sách");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Có lỗi xảy ra!");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #0d1e2e 0%, #0a1520 100%)",
          border: "1px solid rgba(245,197,24,0.18)",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "780px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,197,24,0.08)",
          animation: "slideUp 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.3px",
              }}
            >
              🎬 {playlist?.folderName}
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {savedMovies.length} phim trong danh sách
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(245,197,24,0.15)";
              e.currentTarget.style.color = "#f5c518";
              e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div
          style={{
            overflowY: "auto",
            padding: "16px 24px 24px",
            flex: 1,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(245,197,24,0.3) transparent",
          }}
        >
          {/* EMPTY */}
          {savedMovies.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 0",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(245,197,24,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaFilm size={28} color="rgba(245,197,24,0.25)" />
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                Danh sách chưa có phim nào
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                Thêm phim yêu thích vào đây
              </p>
            </div>
          )}

          {/* MOVIE LIST */}
          {savedMovies.length > 0 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {savedMovies.map((movie, idx) => (
                <MovieRow
                  key={movie.id}
                  movie={movie}
                  idx={idx}
                  onPlay={() => navigate(`/table-watch/${movie.id}`)}
                  onRemove={() => handleRemove(movie.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}

// ── ROW ──
function MovieRow({ movie, idx, onPlay, onRemove }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        background: hovered
          ? "rgba(245,197,24,0.06)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: "12px",
        padding: "10px 14px 10px 10px",
        cursor: "pointer",
        transition: "all 0.2s",
        animationDelay: `${idx * 0.04}s`,
        animation: "slideUp 0.3s ease both",
      }}
    >
      {/* THUMB */}
      <div
        onClick={onPlay}
        style={{
          width: "72px",
          height: "48px",
          borderRadius: "8px",
          flexShrink: 0,
          backgroundImage: movie.imgUrl ? `url(${movie.imgUrl})` : "none",
          backgroundColor: movie.color ?? "#0d2137",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!movie.imgUrl && <FaFilm size={16} color="rgba(255,255,255,0.15)" />}

        {/* play overlay on hover */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <FaPlay size={14} color="#f5c518" />
          </div>
        )}
      </div>

      {/* INFO */}
      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={onPlay}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {movie.name ?? movie.title ?? "Không rõ tên"}
        </p>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "4px",
            alignItems: "center",
          }}
        >
          {movie.rating && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "11px",
                color: "#f5c518",
              }}
            >
              <FaStar size={9} /> {movie.rating}
            </span>
          )}
          {movie.year && (
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
              {movie.year}
            </span>
          )}
          {movie.genre && (
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
              {movie.genre}
            </span>
          )}
        </div>
      </div>

      {/* PLAY BUTTON */}
      <button
        onClick={onPlay}
        title="Xem phim"
        style={{
          background: "rgba(245,197,24,0.12)",
          border: "1px solid rgba(245,197,24,0.25)",
          borderRadius: "8px",
          width: "34px",
          height: "34px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f5c518",
          flexShrink: 0,
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(245,197,24,0.25)";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(245,197,24,0.12)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaPlay size={11} />
      </button>

      {/* REMOVE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Xoá khỏi danh sách"
        style={{
          background: "rgba(255,80,80,0.08)",
          border: "1px solid rgba(255,80,80,0.15)",
          borderRadius: "8px",
          width: "34px",
          height: "34px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,100,100,0.7)",
          flexShrink: 0,
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,80,80,0.2)";
          e.currentTarget.style.color = "#ff5050";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,80,80,0.08)";
          e.currentTarget.style.color = "rgba(255,100,100,0.7)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaTrash size={11} />
      </button>
    </div>
  );
}
