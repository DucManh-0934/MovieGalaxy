import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { FaPlay } from "react-icons/fa";
import { demoMovie } from "../../../untils/Contants";
import "./View.css";
export default function View({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        style: {
          background: "rgba(2, 6, 23, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          width: "65vw",
          height: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "0.3s ease forwards zoomIn",
          background: "rgba(2, 6, 23, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          width: "65vw",
          height: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "zoomCinema 0.35s ease",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)", // 👈 blur nền
          backgroundColor: "rgba(0,0,0,0.6)", // 👈 tối nền
        },
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 text-white">
        <h2 className="text-xl font-bold">🎬 All Movies</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {demoMovie.map((img, index) => (
            <div
              key={index}
              className="group/item relative cursor-pointer transition-all duration-500 hover:-translate-y-4"
            >
              {/* GLOW nền */}
              <div className="absolute -inset-2 bg-yellow-400/10 blur-2xl opacity-0 group-hover/item:opacity-100 transition duration-500" />

              {/* CARD */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                {/* IMAGE */}
                <img
                  src={img}
                  alt=""
                  className="w-full h-[250px] object-cover transition duration-700 group-hover/item:scale-110"
                />

                {/* CINEMA OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* BORDER LIGHT */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover/item:border-yellow-400/40 transition" />

                {/* PLAY BUTTON */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition">
                  <div className="bg-yellow-400 text-black p-3 rounded-full shadow-2xl scale-90 group-hover/item:scale-100 transition">
                    <FaPlay size={14} />
                  </div>
                </div>

                {/* INFO */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover/item:opacity-100 transition">
                  <p className="text-xs text-gray-300">⭐ 8.8 • HD</p>
                </div>
              </div>

              {/* TITLE */}
              <div className="mt-2 transition duration-300 group-hover/item:translate-x-1">
                <p className="text-sm font-semibold text-white truncate group-hover/item:text-yellow-400">
                  Movie {index + 1}
                </p>
                <p className="text-xs text-gray-400 truncate">Subtitle</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
