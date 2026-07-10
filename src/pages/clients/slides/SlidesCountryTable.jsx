import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPlay } from "react-icons/fa";
import { convertDescription } from "../../../services/reponsitory";

export default function SlidesCountryTable({ title, movies = [], onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleWatch = (movieId) => {
    onClose();
    navigate(`/watch/${movieId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,10,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col bg-[#121119] border border-white/10"
      >
        <div className="relative px-6 py-5 bg-gradient-to-r from-yellow-300 via-pink-400 to-pink-500 flex items-center justify-between shrink-0">
          <h2 className="text-white text-3xl font-bold">News {title} Movie</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/40 text-white transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {movies.length === 0 && (
            <p className="text-white/60 col-span-full text-center py-10">
              Chưa có phim nào của {title}.
            </p>
          )}

          {movies.map((m) => (
            <div
              key={m.id}
              onClick={() => handleWatch(m.id)}
              className="group rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-white/25 transition cursor-pointer"
            >
              <div className="relative h-32 bg-black/30">
                {m.imgUrl && (
                  <img src={m.imgUrl} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <FaPlay size={14} className="text-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-semibold leading-tight line-clamp-2">{m.name}</p>
                <p className="text-white/50 text-xs mt-1 line-clamp-2">
                  {convertDescription(m.description || "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}